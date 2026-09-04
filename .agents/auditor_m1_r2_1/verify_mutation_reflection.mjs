import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const contentPath = path.resolve('src/content.ts');
const originalContent = fs.readFileSync(contentPath, 'utf8');

const testToken = 'AUDITOR_QUICK_EDIT_REFLECTION_TEST_TOKEN';
const modifiedContent = originalContent.replace(
  /hero:\s*\{[\s\S]*?badge:\s*"[^"]+"/,
  (m) => m.replace(/"[^"]+"$/, `"${testToken}"`)
);

console.log('Modified equals original?', modifiedContent === originalContent);

try {
  fs.writeFileSync(contentPath, modifiedContent, 'utf8');
  console.log('Build output:');
  const buildOut = execSync('npm run build', { encoding: 'utf8' });
  console.log(buildOut);

  const jsFiles = execSync('find dist -name "*.js"', { encoding: 'utf8' }).trim().split('\n');
  console.log('Found JS files:', jsFiles);

  for (const jsFile of jsFiles) {
    const code = fs.readFileSync(jsFile, 'utf8');
    if (code.includes(testToken)) {
      console.log(`SUCCESS: Token found in ${jsFile}`);
    } else {
      console.log(`Token NOT in ${jsFile}`);
    }
  }
} finally {
  fs.writeFileSync(contentPath, originalContent, 'utf8');
  execSync('npm run build', { encoding: 'utf8' });
  console.log('Clean build restored.');
}
