// Crops the approved logo SVGs in brand/logo/ into public/brand/.
// Crop values come from brand/website-direction.md ("Logo Usage on the Website").
// The source files are never edited.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = (file) => readFile(join(root, 'brand/logo', file), 'utf8');
const outDir = join(root, 'public/brand');

const WARM_CREAM = '#F7F2E8';

/** Replace the root viewBox and intrinsic size so the SVG renders the crop. */
function crop(svg, viewBox) {
  const [, , w, h] = viewBox.split(' ');
  return svg.replace(/<svg\b[^>]*>/, (tag) =>
    tag
      .replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`)
      .replace(/width="[^"]*"/, `width="${w}"`)
      .replace(/height="[^"]*"/, `height="${h}"`),
  );
}

function assertCount(svg, pattern, expected, file) {
  const count = (svg.match(pattern) ?? []).length;
  if (count !== expected) {
    throw new Error(`${file}: expected ${expected} matches of ${pattern}, found ${count}. Re-check the crop rules.`);
  }
}

// Header: letters and ampersand only (first three paths); drop the subline path and gold rules.
async function header() {
  const file = 'concept1-serif-wordmark-transparent.svg';
  let svg = await source(file);
  assertCount(svg, /<path\b/g, 4, file);
  const paths = svg.match(/<path\b[^>]*\/>/g);
  svg = svg.replace(paths[3], '').replace(/<line\b[^>]*\/>/g, '');
  return crop(svg, '124 208 950 148');
}

// Footer: full Cream lockup, unchanged apart from the crop.
async function footer() {
  return crop(await source('concept1-serif-wordmark-on-evergreen-transparent.svg'), '124 208 950 216');
}

// Favicon: monogram seal cropped to the circle on a rounded Warm Cream tile.
async function favicon() {
  const file = 'concept2-monogram-seal.svg';
  let svg = await source(file);
  assertCount(svg, /<rect\b/g, 1, file);
  svg = svg.replace(/<rect\b[^>]*\/>/, `<rect x="216" y="96" width="468" height="468" rx="96" fill="${WARM_CREAM}"/>`);
  return crop(svg, '216 96 468 468');
}

await mkdir(outDir, { recursive: true });
const outputs = {
  'logo-header.svg': await header(),
  'logo-footer.svg': await footer(),
  'favicon.svg': await favicon(),
};
for (const [name, svg] of Object.entries(outputs)) {
  await writeFile(join(outDir, name), svg);
}
console.log(`Logos written to public/brand/: ${Object.keys(outputs).join(', ')}`);
