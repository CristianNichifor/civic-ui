import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { prepareAssets } from '../release-assets.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'civic-release-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'artifacts'));
  const data = Buffer.from('synthetic package bytes');
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
  assert.equal(await readFile(join(root, 'artifacts/release/SHA256SUMS'), 'utf8'), `${metadata.sha256}  civic-ui-0.1.0.tgz\n`);
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
