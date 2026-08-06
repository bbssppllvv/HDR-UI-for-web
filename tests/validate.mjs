import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../index.css', import.meta.url), 'utf8');
const demoCss = await readFile(new URL('../examples/styles.css', import.meta.url), 'utf8');
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

assert.match(css, /@media \(dynamic-range: high\)/);
assert.match(css, /mix-blend-mode: multiply/);
assert.doesNotMatch(css, /dynamic-range-limit/);
assert.match(css, /--hdr-ui-strength/);
assert.match(css, /opacity: var\(--hdr-ui-strength, 10%\)/);
assert.match(css, /:where\(\.hdr-ui\)/);
assert.match(css, /data-peak-nits="600"/);
assert.match(css, /data-peak-nits="1000"/);
assert.match(css, /isolation:\s*isolate/);
assert.match(css, /will-change:\s*opacity/);
assert.doesNotMatch(css, /:hover|:active|:focus-visible|aria-current|aria-pressed|data-hdr-active/);
assert.doesNotMatch(css, /transition|--hdr-ui-duration|prefers-reduced-motion/);
assert.match(css, /background-repeat:\s*no-repeat/);
assert.match(css, /background-size:\s*100% 100%/);
assert.doesNotMatch(css, /https?:\/\//);

const avifMatches = [...css.matchAll(/data:image\/avif;base64,([^"\)]+)/g)];
assert.equal(avifMatches.length, 3, 'Expected 400, 600, and 1000-nit HDR sources');

const demoAvifMatch = demoCss.match(/data:image\/avif;base64,([^"\)]+)/);
assert.ok(demoAvifMatch, 'The demo HDR AVIF is missing');
assert.equal(demoAvifMatch[1], avifMatches[0][1], 'The demo must use the default 400-nit source');

const expectedSources = [
  [400, 'f413d4718c7ba3034e4b5339b64dec0ae9a34643ba6861b0491a378cd78c1961'],
  [600, '5f4d284f7c91bfdd8122eb303bc7e1d87ce274973f9e83116a6f5e550c51d79a'],
  [1000, '045f7505da6f65a3411fd2df6d3ba6fbb99615341d65a0b159e0381805e90add']
];

for (const [index, [peakNits, expectedHash]] of expectedSources.entries()) {
  const avif = Buffer.from(avifMatches[index][1], 'base64');
  assert.equal(avif.byteLength, 309);
  assert.equal(avif.subarray(4, 8).toString('ascii'), 'ftyp');
  assert.ok(avif.subarray(8, 32).includes(Buffer.from('avif')), 'The data URI is not an AVIF file');

  const clliOffset = avif.indexOf(Buffer.from('clli'));
  assert.notEqual(clliOffset, -1, 'The AVIF is missing HDR luminance metadata');
  assert.equal(avif.readUInt16BE(clliOffset + 4), peakNits, 'Unexpected MaxCLL');
  assert.equal(avif.readUInt16BE(clliOffset + 6), peakNits, 'Unexpected MaxPALL');

  const ispeOffset = avif.indexOf(Buffer.from('ispe'));
  assert.notEqual(ispeOffset, -1, 'The AVIF is missing image dimensions');
  assert.equal(avif.readUInt32BE(ispeOffset + 8), 2, 'The HDR AVIF width must be 2px');
  assert.equal(avif.readUInt32BE(ispeOffset + 12), 2, 'The HDR AVIF height must be 2px');
  assert.equal(createHash('sha256').update(avif).digest('hex'), expectedHash);
}

assert.equal(packageJson.exports['.'], './index.css');
assert.equal(packageJson.exports['./styles.css'], './index.css');
assert.equal(packageJson.exports['./index.css'], './index.css');
assert.equal(packageJson.style, './index.css');
assert.equal(packageJson.version, '0.1.2');
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
