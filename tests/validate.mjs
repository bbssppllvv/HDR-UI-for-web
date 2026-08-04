import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../index.css', import.meta.url), 'utf8');
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

assert.match(css, /@media \(dynamic-range: high\)/);
assert.match(css, /mix-blend-mode: multiply/);
assert.match(css, /dynamic-range-limit: no-limit/);
assert.match(css, /--hdr-ui-strength/);
assert.match(css, /opacity: var\(--hdr-ui-strength, 10%\)/);
assert.match(css, /:where\(\.hdr-ui\)/);
assert.doesNotMatch(css, /:hover|:active|:focus-visible|aria-current|aria-pressed|data-hdr-active/);
assert.doesNotMatch(css, /https?:\/\//);

const avifMatch = css.match(/data:image\/avif;base64,([^"\)]+)/);
assert.ok(avifMatch, 'The inline HDR AVIF is missing');

const avif = Buffer.from(avifMatch[1], 'base64');
assert.equal(avif.byteLength, 319);
assert.equal(avif.subarray(4, 8).toString('ascii'), 'ftyp');
assert.ok(avif.subarray(8, 32).includes(Buffer.from('avif')), 'The data URI is not an AVIF file');
assert.equal(
  createHash('sha256').update(avif).digest('hex'),
  '0c6677f29983e270bb7571413336baf96158a808b639c40c16edfee7cb197665'
);

assert.equal(packageJson.exports['.'], './index.css');
assert.equal(packageJson.exports['./styles.css'], './index.css');
assert.equal(packageJson.exports['./index.css'], './index.css');
assert.equal(packageJson.style, './index.css');
assert.ok(packageJson.sideEffects.includes('**/*.css'));
assert.ok(packageJson.files.includes('index.css'));

for (const dependencyField of [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
  'bundledDependencies'
]) {
  assert.ok(!packageJson[dependencyField], `${dependencyField} must remain empty`);
}

console.log('hdr-ui-for-web validation passed');
