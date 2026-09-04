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

const jsxTextRegex = />([^<>{}\r\n]+)</g;

console.log('=== SCANNING FOR LITERAL TEXT IN JSX ===');
const files = walk('src');
let findings = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, lineNo) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('{/*') || trimmed.startsWith('*')) return;
    let match;
    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim();
      // Skip empty or purely punctuation/digits
      if (!text || /^[\s\d.,:;!?&%$#@*()_+\-–—•/\\|<>"'=]+$/.test(text)) continue;
      findings.push({ file: f, line: lineNo + 1, text, lineContent: trimmed });
    }
  });
});

console.log(`Total findings: ${findings.length}`);
findings.forEach(f => {
  console.log(`${f.file}:${f.line} -> "${f.text}"`);
});
