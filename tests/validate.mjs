import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../index.css', import.meta.url), 'utf8');
const demoCss = await readFile(new URL('../examples/styles.css', import.meta.url), 'utf8');
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

assert.match(css, /@media \(dynamic-range: high\)/);
assert.match(css, /mix-blend-mode: multiply/);
assert.match(css, /dynamic-range-limit: no-limit/);
assert.match(css, /--hdr-ui-strength/);
assert.match(css, /opacity: var\(--hdr-ui-strength, 10%\)/);
assert.match(css, /:where\(\.hdr-ui\)/);
assert.match(css, /isolation:\s*isolate/);
assert.match(css, /will-change:\s*opacity/);
assert.doesNotMatch(css, /:hover|:active|:focus-visible|aria-current|aria-pressed|data-hdr-active/);
assert.doesNotMatch(css, /transition|--hdr-ui-duration|prefers-reduced-motion/);
assert.match(css, /background-repeat:\s*no-repeat/);
assert.match(css, /background-size:\s*100% 100%/);
assert.doesNotMatch(css, /https?:\/\//);

const avifMatch = css.match(/data:image\/avif;base64,([^"\)]+)/);
assert.ok(avifMatch, 'The inline HDR AVIF is missing');

const demoAvifMatch = demoCss.match(/data:image\/avif;base64,([^"\)]+)/);
assert.ok(demoAvifMatch, 'The demo HDR AVIF is missing');
assert.equal(demoAvifMatch[1], avifMatch[1], 'The package and demo must use the same HDR AVIF');

const avif = Buffer.from(avifMatch[1], 'base64');
assert.equal(avif.byteLength, 309);
assert.equal(avif.subarray(4, 8).toString('ascii'), 'ftyp');
assert.ok(avif.subarray(8, 32).includes(Buffer.from('avif')), 'The data URI is not an AVIF file');
assert.ok(avif.includes(Buffer.from('clli')), 'The AVIF is missing HDR luminance metadata');

const ispeOffset = avif.indexOf(Buffer.from('ispe'));
assert.notEqual(ispeOffset, -1, 'The AVIF is missing image dimensions');
assert.equal(avif.readUInt32BE(ispeOffset + 8), 2, 'The HDR AVIF width must be 2px');
assert.equal(avif.readUInt32BE(ispeOffset + 12), 2, 'The HDR AVIF height must be 2px');
assert.equal(
  createHash('sha256').update(avif).digest('hex'),
  '01b9b53086bb68c5e1b47a84178a66121895d47822461e98b6850b4fcf6698d2'
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
