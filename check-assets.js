/* ====================================================================
   Pre-deploy asset check
   --------------------------------------------------------------------
   Scans every built page AND script.js for referenced images, then
   confirms each one is actually present in the folder being deployed.

   This exists because a deploy once shipped only .webp files while
   script.js still asked for .jpg — the images 404'd and silently fell
   back to gradient placeholders. Cheap check, expensive bug.

   USAGE:  node check-assets.js <publish-dir>
   Exits non-zero if anything is missing, so a deploy can be aborted.
   ==================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const PUB = process.argv[2];
if (!PUB) { console.error('usage: node check-assets.js <publish-dir>'); process.exit(2); }

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(PUB);
const present = new Set(files.map(f => path.relative(PUB, f).replace(/\\/g, '/')));

const refs = new Map();                       // asset -> where it was referenced
const assetRe = /(?:src|srcset|href)="\/?([a-z0-9._-]+\.(?:jpg|jpeg|png|webp|svg))"/gi;
const jsRe    = /'([a-z0-9._-]+\.(?:jpg|jpeg|png|webp|svg))'/gi;

for (const f of files) {
  const rel = path.relative(PUB, f).replace(/\\/g, '/');
  if (!/\.(html|js)$/.test(f)) continue;
  const text = fs.readFileSync(f, 'utf8');
  const re = f.endsWith('.js') ? jsRe : assetRe;
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text))) {
    if (!refs.has(m[1])) refs.set(m[1], []);
    refs.get(m[1]).push(rel);
  }
}

const missing = [...refs.keys()].filter(a => !present.has(a));

console.log(`  scanned ${files.filter(f => /\.(html|js)$/.test(f)).length} html/js files`);
console.log(`  ${refs.size} distinct assets referenced, ${present.size} files staged`);

if (missing.length) {
  console.error('\n  ✗ MISSING ASSETS — deploy would show broken images:');
  for (const a of missing) {
    console.error(`      ${a}`);
    console.error(`        referenced by: ${[...new Set(refs.get(a))].join(', ')}`);
  }
  process.exit(1);
}
console.log('  ✓ every referenced asset is present');
