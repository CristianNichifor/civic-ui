import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, copyFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

export const nativeFiles = [
  'LICENSE', 'NATIVE.md', 'native.css', 'styles.css', 'foundations.css',
  'controls.css', 'themes/neutral.css', 'themes/usr.css',
];

export async function prepareNativeAsset(source, output, version) {
  const temporary = await mkdtemp(join(tmpdir(), 'civic-native-'));
  try {
    const entries = nativeFiles.map(name => `package/${name.endsWith('.css') ? 'dist/' : ''}${name}`);
    execFileSync('tar', ['-xzf', source, '-C', temporary, ...entries]);
    const stage = resolve(temporary, 'civic-ui-css');
    await mkdir(resolve(stage, 'themes'), { recursive: true });
    for (const [index, name] of nativeFiles.entries()) {
      await copyFile(resolve(temporary, entries[index]), resolve(stage, name));
    }
    await mkdir(output, { recursive: true });
    const filename = `civic-ui-css-${version}.tgz`;
    // Stable metadata makes identical verified CSS bytes produce identical archives.
    execFileSync('tar', ['--sort=name', '--mtime=@0', '--owner=0', '--group=0', '--numeric-owner',
      '-czf', resolve(output, filename), '-C', stage, ...nativeFiles]);
    const sha256 = createHash('sha256').update(await readFile(resolve(output, filename))).digest('hex');
    return { filename, sha256 };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
