const fs = require('fs');
const path = require('path');

function parseDictionary(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dict = {};
  const regex = /['"]?([a-zA-Z0-9_\-\.]+)['"]?\s*:\s*(['"`])((?:[^\\]|\\.)*?)\2/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const val = match[3];
    if (!['import', 'export', 'type', 'TranslationDictionary'].includes(key)) {
      dict[key] = val;
    }
  }
  return dict;
}

const localesDir = path.join(__dirname, '../src/i18n/locales');
const enDict = parseDictionary(path.join(localesDir, 'en.ts'));
const enKeys = Object.keys(enDict);

console.log(`Master English dictionary key count: ${enKeys.length}`);

const files = fs.readdirSync(localesDir).filter((f) => f.endsWith('.ts'));

files.forEach((file) => {
  if (file === 'en.ts') return;
  const langDict = parseDictionary(path.join(localesDir, file));
  const missing = enKeys.filter((k) => !(k in langDict));
  
  console.log(`\n--- [${file.replace('.ts', '')}] ---`);
  console.log(`Present: ${Object.keys(langDict).length}, Missing: ${missing.length}`);
  if (missing.length > 0) {
    console.log(`Missing keys sample (up to 20):`, missing.slice(0, 20));
  }
});
