import { readFileSync } from 'node:fs';

// The showcase header reports the version of the package actually installed.
const { version } = JSON.parse(readFileSync(new URL('./node_modules/@cristiannichifor/civic-ui/package.json', import.meta.url), 'utf8'));
export default {
  define: { __CIVIC_VERSION__: JSON.stringify(version) },
  build: { rollupOptions: { input: { fixture: 'index.html', showcase: 'showcase.html', locale: 'locale.html', site: 'site.html' } } },
};
