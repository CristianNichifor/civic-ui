import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('.', import.meta.url));
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const offline = process.env.CIVIC_OFFLINE === '1' ? ['--offline'] : [];
await mkdir(resolve(root, 'artifacts'), { recursive: true });
run('npm', ['run', 'build']);
const packed = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', 'artifacts'], { cwd: root, encoding: 'utf8' }))[0];
const expectedFiles = ['README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'RELEASING.md', 'CHANGELOG.md', 'package.json', 'dist/index.js', 'dist/index.d.ts',
  'dist/components.d.ts', 'dist/styles.css', 'dist/foundations.css', 'dist/controls.css',
  'dist/themes/usr.css', 'dist/themes/neutral.css', 'dist/licenses/react-LICENSE', 'dist/licenses/lucide-react-LICENSE'];
assert.deepEqual(packed.files.map(({ path }) => path).sort(), expectedFiles.sort());
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
assert.equal(manifest.private, true);
assert.equal(manifest.license, 'MIT');
assert.match(await readFile(resolve(root, 'LICENSE'), 'utf8'), /MIT License/);
for (const name of ['react', 'lucide-react']) {
  assert.equal(await readFile(resolve(root, 'dist/licenses', `${name}-LICENSE`), 'utf8'),
    await readFile(resolve(root, 'node_modules', name, 'LICENSE'), 'utf8'));
}
const js = await readFile(resolve(root, 'dist/index.js'), 'utf8');
assert(!js.includes('/home/') && !js.includes('usr.css') && !js.includes('neutral.css'));
const tarball = resolve(root, 'artifacts', packed.filename);
const results = { package: packed.filename, sha256: createHash('sha256').update(await readFile(tarball)).digest('hex'), consumers: [] };
for (const [major, react, types, domTypes] of [[18, '18.3.1', '18.3.31', '18.3.7'], [19, '19.1.1', '19.2.18', '19.2.7']]) {
  const dir = resolve(root, `artifacts/react${major}`);
  // Always test the newly packed bytes, not npm's previous same-version installation.
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  for (const name of ['index.html', 'main.tsx', 'type-contract.tsx', 'host.css', 'tsconfig.json', 'showcase.html', 'showcase.tsx', 'showcase.css', 'vite.config.js']) await copyFile(resolve(root, 'fixtures', name), resolve(dir, name));
  for (const name of ['package.json', 'package-lock.json']) {
    await copyFile(resolve(root, `fixtures/react${major}`, name), resolve(dir, name));
  }
  run('npm', ['ci', ...offline, '--ignore-scripts', '--no-audit', '--no-fund'], dir);
  // Install only the artifact under test; committed fixture locks contain no local paths.
  run('npm', ['install', tarball, ...offline, '--no-save', '--package-lock=false', '--ignore-scripts', '--no-audit', '--no-fund'], dir);
  assert.equal(await readFile(resolve(dir, 'package-lock.json'), 'utf8'),
    await readFile(resolve(root, `fixtures/react${major}/package-lock.json`), 'utf8'));
  run('npm', ['ls', 'react', 'react-dom', 'lucide-react'], dir);
  run(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '--project', 'tsconfig.json'], dir);
  run(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'build', '--base', './'], dir);
  results.consumers.push({ react, types, typecheck: 'passed', build: 'passed' });
}
await writeFile(resolve(root, 'artifacts/package-results.json'), JSON.stringify(results, null, 2) + '\n');
