const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../src/i18n/locales/en.ts');
const content = fs.readFileSync(enPath, 'utf8');

const regex = /^\s*('?[a-zA-Z0-9_\-\.]+'?)\s*:\s*('(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)\s*,?/gm;
const seen = new Set();
const cleanLines = [];

const lines = content.split('\n');
lines.forEach((line) => {
  const match = /^\s*('?[a-zA-Z0-9_\-\.]+'?)\s*:\s*/.exec(line);
  if (match) {
    let key = match[1].trim();
    if ((key.startsWith("'") && key.endsWith("'")) || (key.startsWith('"') && key.endsWith('"'))) {
      key = key.slice(1, -1);
    }
    if (seen.has(key)) {
      console.log(`Removing duplicate key in en.ts: ${key}`);
      return; // Skip duplicate line
    }
    seen.add(key);
  }
  cleanLines.push(line);
});

fs.writeFileSync(enPath, cleanLines.join('\n'), 'utf8');
console.log('Deduplicated en.ts successfully!');
