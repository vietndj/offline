import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else if (full.endsWith('.tsx')) files.push(full);
  }
  return files;
}

const files = walk('src');
console.log(`Analyzing ${files.length} TSX files for CONTENT consumption...`);

const results = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasContentImport = /import\s+.*CONTENT.*from/s.test(content) || /from\s+['"].*content['"]/.test(content);
  const contentAccessMatches = content.match(/CONTENT\.([a-zA-Z0-9_]+)/g) || [];
  const uniqueProps = [...new Set(contentAccessMatches)];
  const lineCount = content.split('\n').length;
  const isFacade = content.includes('return null') && lineCount < 20;

  results.push({
    file,
    lineCount,
    hasContentImport,
    propsAccessed: uniqueProps,
    isFacade
  });
});

results.forEach(r => {
  console.log(`- ${r.file} (${r.lineCount} lines)`);
  console.log(`  Imports CONTENT: ${r.hasContentImport}`);
  console.log(`  Properties: ${r.propsAccessed.join(', ') || 'None (or via props)'}`);
  console.log(`  Facade check: ${r.isFacade ? 'FACADE DETECTED' : 'GENUINE'}`);
});
