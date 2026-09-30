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
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));

console.log(`Scanning ${files.length} files for hardcoded user-facing text...`);

// Patterns that indicate hardcoded strings in JSX like >Some Text< or placeholder="Some text"
const hardcodedJSXRegex = />\s*([A-[Z][a-zA-Z0-9\s,\.\?\!\:\-–—"'\(\)]{3,})\s*</g;

files.forEach((file) => {
  if (file.includes('/locales/') || file.includes('/data/')) return;
  const content = fs.readFileSync(file, 'utf8');
  let match;
  const found = [];
  while ((match = hardcodedJSXRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (
      !text.startsWith('http') &&
      !text.includes('className') &&
      !text.includes('return') &&
      !text.includes('import') &&
      text.length > 3
    ) {
      found.push(text);
    }
  }
  if (found.length > 0) {
    console.log(`\nFile: ${path.relative(process.cwd(), file)} (${found.length} suspicious JSX strings)`);
    console.log('   Sample:', found.slice(0, 5));
  }
});
