import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Collect custom properties per selector block (flat CSS only).
async function blocks(file) {
  const css = (await readFile(new URL(`../${file}`, import.meta.url), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
  const result = {};
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const tokens = Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));
    result[selector.trim()] = { ...(result[selector.trim()] ?? {}), ...tokens };
  }
  return result;
}
const luminance = hex => {
  const [r, g, b] = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i).slice(1).map(x => parseInt(x, 16) / 255)
    .map(c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const saturation = hex => { const [r, g, b] = hex.slice(1).match(/../g).map(x => parseInt(x, 16)); return Math.max(r, g, b) - Math.min(r, g, b); };

const foundations = (await blocks('src/foundations.css'))['.civic-scope'];
const neutral = await blocks('themes/neutral.css');
const light = { ...foundations, ...neutral['.civic-neutral'] };
const dark = { ...light, ...neutral['.civic-neutral[data-civic-mode="dark"]'] };

test('scales are defined on every scope and keep the existing space step', () => {
  for (let i = 1; i <= 8; i++) assert.ok(foundations[`--civic-space-${i}`], `--civic-space-${i}`);
  assert.equal(foundations['--civic-space-2'], '0.5rem');
  for (const step of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']) assert.match(foundations[`--civic-text-${step}`], /rem$/);
  for (const weight of ['regular', 'heading', 'strong']) assert.match(foundations[`--civic-weight-${weight}`], /^\d00$/);
});

for (const [mode, tokens] of [['light', light], ['dark', dark]]) {
  test(`${mode}: every status on-colour reaches 4.5:1 on its fill`, () => {
    for (const role of ['success', 'warning', 'info', 'danger']) {
      const ratio = contrast(tokens[`--civic-${role}`], tokens[`--civic-on-${role}`]);
      assert.ok(ratio >= 4.5, `${role} ${ratio.toFixed(2)}`);
    }
  });
  test(`${mode}: categorical palette has eight distinct slots`, () => {
    const slots = Array.from({ length: 8 }, (_, i) => tokens[`--civic-viz-${i + 1}`]);
    slots.forEach(slot => assert.match(slot, /^#[0-9a-f]{6}$/i));
    assert.equal(new Set(slots).size, 8);
  });
  test(`${mode}: sequential ramp is monotonic and starts nearest the surface`, () => {
    const ramp = Array.from({ length: 7 }, (_, i) => contrast(tokens[`--civic-viz-seq-${i + 1}`], tokens['--civic-surface']));
    ramp.slice(1).forEach((ratio, i) => assert.ok(ratio > ramp[i], `step ${i + 2} must contrast more than step ${i + 1}`));
  });
  test(`${mode}: diverging arms are monotonic around a grey midpoint`, () => {
    const surface = tokens['--civic-surface'];
    assert.ok(saturation(tokens['--civic-viz-div-mid']) <= 12, 'midpoint must be grey');
    for (const arm of ['n', 'p']) {
      const ratios = [1, 2, 3].map(i => contrast(tokens[`--civic-viz-div-${arm}${i}`], surface));
      assert.ok(ratios[0] < ratios[1] && ratios[1] < ratios[2], `${arm} arm ${ratios.map(r => r.toFixed(2))}`);
    }
  });
}
