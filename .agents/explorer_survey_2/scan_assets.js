import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const projectRoot = '/Users/vietmac/Documents/CODE/offline';
const publicDir = path.join(projectRoot, 'public');

// Recursively get all files
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Read all code files to search for references
const srcFiles = getAllFiles(path.join(projectRoot, 'src'));
srcFiles.push(path.join(projectRoot, 'index.html'));

let codeCorpus = '';
for (const f of srcFiles) {
  if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.json')) {
    codeCorpus += '\n' + fs.readFileSync(f, 'utf8');
  }
}

const publicFiles = getAllFiles(publicDir);

const assetStats = [];
const hashMap = {};

for (const f of publicFiles) {
  const relPath = path.relative(publicDir, f);
  const stat = fs.statSync(f);
  const size = stat.size;
  const ext = path.extname(f).toLowerCase();
  const basename = path.basename(f);
  
  // Calculate md5 hash for duplicate detection
  const buf = fs.readFileSync(f);
  const hash = crypto.createHash('md5').update(buf).digest('hex');

  if (!hashMap[hash]) {
    hashMap[hash] = [];
  }
  hashMap[hash].push(relPath);

  // Search if referenced in codeCorpus
  // Match relative path, filename, or without leading slash
  const searchTerms = [
    basename,
    relPath,
    '/' + relPath,
    relPath.replace(/\\/g, '/')
  ];
  
  const isReferenced = searchTerms.some(term => codeCorpus.includes(term));

  assetStats.push({
    path: relPath,
    fullPath: f,
    size,
    ext,
    basename,
    hash,
    isReferenced
  });
}

// Print Summary
console.log(`Total files in public/: ${assetStats.length}`);
const totalSize = assetStats.reduce((sum, a) => sum + a.size, 0);
console.log(`Total public/ size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB (${totalSize} bytes)\n`);

console.log('=== DUPLICATES ===');
for (const [hash, list] of Object.entries(hashMap)) {
  if (list.length > 1) {
    console.log(`Identical files (${list.length}): ${list.join(' <=> ')}`);
  }
}

console.log('\n=== UNREFERENCED ASSETS IN CODE ===');
const unreferenced = assetStats.filter(a => !a.isReferenced);
console.log(`Count: ${unreferenced.length}`);
for (const a of unreferenced.sort((x, y) => y.size - x.size)) {
  console.log(`  ${(a.size / 1024).toFixed(1)} KB - ${a.path}`);
}

console.log('\n=== OVERSIZED ASSETS (> 1 MB) ===');
const oversized = assetStats.filter(a => a.size >= 1024 * 1024);
console.log(`Count: ${oversized.length}`);
for (const a of oversized.sort((x, y) => y.size - x.size)) {
  console.log(`  ${(a.size / (1024 * 1024)).toFixed(2)} MB - ${a.path} (Referenced: ${a.isReferenced})`);
}

console.log('\n=== LARGE ASSETS (200 KB - 1 MB) ===');
const medium = assetStats.filter(a => a.size >= 200 * 1024 && a.size < 1024 * 1024);
console.log(`Count: ${medium.length}`);
for (const a of medium.sort((x, y) => y.size - x.size)) {
  console.log(`  ${(a.size / 1024).toFixed(1)} KB - ${a.path} (Referenced: ${a.isReferenced})`);
}

console.log('\n=== ASSET BREAKDOWN BY CATEGORY ===');
const cats = {};
for (const a of assetStats) {
  let cat = a.ext;
  cats[cat] = cats[cat] || { count: 0, size: 0 };
  cats[cat].count++;
  cats[cat].size += a.size;
}
for (const [ext, stat] of Object.entries(cats).sort((a, b) => b[1].size - a[1].size)) {
  console.log(`  ${ext}: ${stat.count} files, ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}
