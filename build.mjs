import { build } from 'vite';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const source = resolve(root, 'src');
await build({
  configFile: false,
  root,
  build: {
    outDir: 'dist',
    lib: { entry: resolve(source, 'index.ts'), formats: ['es'], fileName: () => 'index.js' },
    rollupOptions: { external: id => /^(react|react-dom|lucide-react|@radix-ui\/[^/]+)(\/|$)/.test(id) },
    minify: false,
  },
  esbuild: { jsx: 'automatic' },
});
execFileSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'),
  resolve(source, 'index.ts'), '--declaration', '--emitDeclarationOnly',
  '--strict', '--jsx', 'react-jsx', '--module', 'ESNext', '--moduleResolution', 'Bundler',
  '--target', 'ES2022', '--rootDir', source, '--outDir', resolve(root, 'dist'),
], { stdio: 'inherit' });
await mkdir(resolve(root, 'dist/themes'), { recursive: true });
for (const name of ['foundations.css', 'controls.css']) {
  await copyFile(resolve(source, name), resolve(root, 'dist', name));
}
await writeFile(resolve(root, 'dist/styles.css'), '@import "./foundations.css";\n@import "./controls.css";\n');
await copyFile(resolve(source, 'usr.css'), resolve(root, 'dist/themes/usr.css'));
await copyFile(resolve(root, 'themes/neutral.css'), resolve(root, 'dist/themes/neutral.css'));
await mkdir(resolve(root, 'dist/licenses'), { recursive: true });
for (const name of ['react', 'lucide-react']) {
  await copyFile(resolve(root, 'node_modules', name, 'LICENSE'), resolve(root, 'dist/licenses', `${name}-LICENSE`));
}
