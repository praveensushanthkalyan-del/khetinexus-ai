const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src/components'));

console.log(`Deep scanning ${files.length} component files...`);

// Regex to capture JSX text nodes, placeholder="...", title="...", alt="...", label="..."
const jsxTextRegex = />\s*([A-Za-z0-9\s,\.\?\!\:\-–—"'\(\)\/]{3,})\s*</g;
const propRegex = /(placeholder|title|aria-label|label|alt)\s*=\s*["']([^"']{3,})["']/g;

const foundStrings = new Map();

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  
  while ((match = jsxTextRegex.exec(content)) !== null) {
    const str = match[1].trim();
    if (str && !str.startsWith('{') && !str.includes('t.') && !/^[0-9\.\s\%°]+$/.test(str)) {
      if (!foundStrings.has(str)) foundStrings.set(str, []);
      foundStrings.get(str).push(path.basename(file));
    }
  }

  while ((match = propRegex.exec(content)) !== null) {
    const str = match[2].trim();
    if (str && !str.includes('t.') && !/^[0-9\.\s\%°]+$/.test(str)) {
      if (!foundStrings.has(str)) foundStrings.set(str, []);
      foundStrings.get(str).push(path.basename(file));
    }
  }
});

console.log(`\nFound ${foundStrings.size} distinct user-visible string candidates across components:`);
let count = 0;
foundStrings.forEach((files, str) => {
  if (count < 40) {
    console.log(`- "${str}" in [${Array.from(new Set(files)).join(', ')}]`);
  }
  count++;
});
