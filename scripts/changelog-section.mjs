// Print one version's CHANGELOG.md section, for the body of its GitHub release.
// Usage: node scripts/changelog-section.mjs <version> [changelog path]
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function changelogSection(text, version) {
  const lines = text.split('\n');
  // A heading may carry a date: "## 0.8.0 — 2026-10-14".
  const start = lines.findIndex(line => {
    const heading = line.trim();
    return heading === `## ${version}` || heading.startsWith(`## ${version} — `);
  });
  if (start === -1) throw new Error(`CHANGELOG.md has no "## ${version}" section`);
  const next = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  const body = lines.slice(start + 1, next === -1 ? undefined : next).join('\n').trim();
  if (!body) throw new Error(`CHANGELOG.md section "## ${version}" is empty`);
  return `${body}\n`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [version, file = fileURLToPath(new URL('../CHANGELOG.md', import.meta.url))] = process.argv.slice(2);
  if (!version) {
    console.error('Usage: node scripts/changelog-section.mjs <version> [changelog path]');
    process.exit(2);
  }
  try {
    process.stdout.write(changelogSection(await readFile(file, 'utf8'), version));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
