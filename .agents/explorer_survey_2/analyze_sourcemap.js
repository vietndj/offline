import fs from 'fs';
import path from 'path';

const distDir = '/Users/vietmac/Documents/CODE/offline/dist/assets';
const files = fs.readdirSync(distDir);
const mapFile = files.find(f => f.endsWith('.js.map'));

if (!mapFile) {
  console.log('No map file found');
  process.exit(1);
}

const mapPath = path.join(distDir, mapFile);
const raw = fs.readFileSync(mapPath, 'utf8');
const map = JSON.parse(raw);

const moduleSizes = {};

if (map.sources && map.sourcesContent) {
  for (let i = 0; i < map.sources.length; i++) {
    const src = map.sources[i];
    const content = map.sourcesContent[i] || '';
    
    // Categorize
    let category = 'other';
    if (src.includes('node_modules/')) {
      const match = src.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
      category = match ? match[1] : 'node_modules';
    } else if (src.includes('src/')) {
      category = 'src/' + src.split('src/')[1].split('/')[0];
    }
    
    moduleSizes[category] = (moduleSizes[category] || 0) + content.length;
  }
}

const sorted = Object.entries(moduleSizes).sort((a, b) => b[1] - a[1]);
console.log('Top sourcesContent sizes:');
for (const [cat, size] of sorted) {
  console.log(`  ${cat}: ${(size / 1024).toFixed(2)} KB (${size} bytes)`);
}
