import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { prepareNativeAsset } from './native-assets.mjs';

export async function prepareAssets(root) {
  const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.private, true);
  const results = JSON.parse(await readFile(resolve(root, 'artifacts/package-results.json'), 'utf8'));
  const packedName = `${manifest.name.replace(/^@/, '').replace('/', '-')}-${manifest.version}.tgz`;
  assert.equal(results.package, packedName, 'Verification must match the current package version');
  assert.deepEqual(results.consumers.map(({ react, typecheck, build }) => [react, typecheck, build]),
    [['18.3.1', 'passed', 'passed'], ['19.1.1', 'passed', 'passed']]);
  const source = resolve(root, 'artifacts', packedName);
  const digest = createHash('sha256').update(await readFile(source)).digest('hex');
  assert.equal(digest, results.sha256, 'Verified tarball was modified');
  const output = resolve(root, 'artifacts/release');
  const filename = `civic-ui-${manifest.version}.tgz`;
  await mkdir(output, { recursive: true });
  await copyFile(source, resolve(output, filename));
  const native = await prepareNativeAsset(source, output, manifest.version);
  await writeFile(resolve(output, 'SHA256SUMS'), `${digest}  ${filename}\n${native.sha256}  ${native.filename}\n`);
  return { tag: `v${manifest.version}`, filename, sha256: digest, native };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await prepareAssets(fileURLToPath(new URL('.', import.meta.url)))));
}
