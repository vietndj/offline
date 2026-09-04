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

// Regex for attributes with static string literals: title="...", placeholder="...", alt="...", aria-label="..."
const attrRegex = /(title|placeholder|alt|aria-label)\s*=\s*"([^"]+)"/g;

console.log('=== SCANNING FOR HARDCODED ATTRIBUTE STRINGS IN JSX ===');
const files = walk('src');
let findings = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, lineNo) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('{/*') || trimmed.startsWith('*')) return;
    let match;
    while ((match = attrRegex.exec(line)) !== null) {
      const attr = match[1];
      const val = match[2].trim();
      findings.push({ file: f, line: lineNo + 1, attr, val, lineContent: trimmed });
    }
  });
});

console.log(`Total attribute findings: ${findings.length}`);
findings.forEach(f => {
  console.log(`${f.file}:${f.line} -> ${f.attr}="${f.val}"`);
});
