import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { prepareAssets } from '../release-assets.mjs';
import { execFileSync } from 'node:child_process';
import { nativeFiles } from '../native-assets.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'civic-release-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'artifacts'));
  await mkdir(join(root, 'package/dist/themes'), { recursive: true });
  for (const name of nativeFiles) {
    await writeFile(join(root, 'package', name.endsWith('.css') ? 'dist' : '', name), `synthetic ${name}`);
  }
  await writeFile(join(root, 'package/dist/index.js'), 'react runtime must not enter CSS archive');
  const archive = join(root, 'artifacts/cristiannichifor-civic-ui-0.1.0.tgz');
  execFileSync('tar', ['-czf', archive, '-C', root, 'package']);
  const data = await readFile(archive);
  const metadata = {
    package: 'cristiannichifor-civic-ui-0.1.0.tgz',
    sha256: createHash('sha256').update(data).digest('hex'),
    consumers: ['18.3.1', '19.1.1'].map(react => ({ react, typecheck: 'passed', build: 'passed' })),
  };
  await writeFile(join(root, 'package.json'), JSON.stringify({ name: '@cristiannichifor/civic-ui', version: '0.1.0', private: true }));
  await writeFile(join(root, 'artifacts', metadata.package), data);
  const save = () => writeFile(join(root, 'artifacts/package-results.json'), JSON.stringify(metadata));
  await save();
  return { root, metadata, save, data };
}
test('release assets preserve the verified tarball and checksum', async t => {
  const { root, data, metadata } = await fixture(t);
  const result = await prepareAssets(root);
  assert.equal(result.tag, 'v0.1.0');
  assert.deepEqual(await readFile(join(root, 'artifacts/release', result.filename)), data);
  assert.equal(await readFile(join(root, 'artifacts/release/SHA256SUMS'), 'utf8'),
    `${metadata.sha256}  civic-ui-0.1.0.tgz\n${result.native.sha256}  civic-ui-css-0.1.0.tgz\n`);
  const nativePath = join(root, 'artifacts/release', result.native.filename);
  const entries = execFileSync('tar', ['-tzf', nativePath], { encoding: 'utf8' }).trim().split('\n');
  assert.deepEqual(entries.sort(), [...nativeFiles].sort());
  for (const name of nativeFiles) {
    assert.equal(execFileSync('tar', ['-xOf', nativePath, name], { encoding: 'utf8' }), `synthetic ${name}`);
  }
  assert.equal(createHash('sha256').update(await readFile(nativePath)).digest('hex'), result.native.sha256);
  const repeated = await prepareAssets(root);
  assert.equal(repeated.native.sha256, result.native.sha256, 'CSS archive is reproducible');
});
test('modified tarball is rejected', async t => {
  const { root, metadata } = await fixture(t);
  await writeFile(join(root, 'artifacts', metadata.package), 'changed');
  await assert.rejects(prepareAssets(root), /modified/);
});
test('stale version is rejected', async t => {
  const { root, metadata, save } = await fixture(t);
  metadata.package = 'cristiannichifor-civic-ui-0.0.0-pilot.5.tgz';
  await save();
  await assert.rejects(prepareAssets(root), /current package version/);
});
test('failed consumer verification is rejected', async t => {
  const { root, metadata, save } = await fixture(t);
  metadata.consumers[0].build = 'failed';
  await save();
  await assert.rejects(prepareAssets(root));
});
test('missing native stylesheet is rejected even when the package digest matches', async t => {
  const { root, metadata, save } = await fixture(t);
  await rm(join(root, 'package/dist/native.css'));
  const source = join(root, 'artifacts', metadata.package);
  execFileSync('tar', ['-czf', source, '-C', root, 'package']);
  metadata.sha256 = createHash('sha256').update(await readFile(source)).digest('hex');
  await save();
  await assert.rejects(prepareAssets(root), /native.css/);
});

import { changelogSection } from '../scripts/changelog-section.mjs';
const changelog = `# Changelog

## Unreleased

- Pending entry.

## 0.2.0

Published on GitHub Releases.

- Second entry.
  Wrapped line.

### Notes

Nested heading stays.

## 0.1.0

- First entry.
`;
test('changelog section returns only the requested version body', () => {
  assert.equal(changelogSection(changelog, '0.2.0'),
    'Published on GitHub Releases.\n\n- Second entry.\n  Wrapped line.\n\n### Notes\n\nNested heading stays.\n');
  assert.equal(changelogSection(changelog, '0.1.0'), '- First entry.\n');
  assert.equal(changelogSection(changelog, 'Unreleased'), '- Pending entry.\n');
});
test('changelog section accepts a dated heading', () => {
  assert.equal(changelogSection('## 1.1.0 — 2026-10-14\n\n- Dated.\n\n## 1.0.0\n- x\n', '1.1.0'), '- Dated.\n');
  assert.throws(() => changelogSection('## 1.1.0-rc.1 — 2026-10-14\n- x\n', '1.1.0'), /1\.1\.0/);
});
test('changelog section rejects a missing or empty version', () => {
  assert.throws(() => changelogSection(changelog, '0.3.0'), /0\.3\.0/);
  assert.throws(() => changelogSection('## 1.0.0\n\n## 0.9.0\n- x\n', '1.0.0'), /empty/);
  assert.throws(() => changelogSection(changelog, '0.2'), /0\.2\b/);
});
test('changelog section command prints the body for the release workflow', () => {
  const output = execFileSync(process.execPath, ['scripts/changelog-section.mjs', '0.7.0'], { encoding: 'utf8' });
  assert.match(output, /Switch/);
  assert.doesNotMatch(output, /^## /m);
  assert.throws(() => execFileSync(process.execPath, ['scripts/changelog-section.mjs', '9.9.9'], { stdio: 'pipe' }));
});
