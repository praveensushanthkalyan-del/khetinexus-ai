const fs = require('fs');
const path = require('path');

// We will read en.ts to get master keys
const enFilePath = path.join(__dirname, '../src/i18n/locales/en.ts');
const enContent = fs.readFileSync(enFilePath, 'utf8');

// Simple key-value parser for typescript dictionary files
function parseTsDict(fileContent) {
  const dict = {};
  // match lines like   keyName: 'value', or 'key.name': 'value',
  const regex = /^\s*('?[a-zA-Z0-9_\-\.]+'?)\s*:\s*('(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)\s*,?/gm;
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    let rawKey = match[1].trim();
    let rawVal = match[2].trim();
    
    // strip quotes from key if needed
    if ((rawKey.startsWith("'") && rawKey.endsWith("'")) || (rawKey.startsWith('"') && rawKey.endsWith('"'))) {
      rawKey = rawKey.slice(1, -1);
    }
    dict[rawKey] = rawVal;
  }
  return dict;
}

const masterDict = parseTsDict(enContent);
const masterKeys = Object.keys(masterDict);
console.log(`Master en.ts contains ${masterKeys.length} keys.`);

const localeFiles = [
  'hi.ts', 'te.ts', 'ta.ts', 'kn.ts', 'ml.ts', 'mr.ts', 'gu.ts', 'bn.ts',
  'pa.ts', 'or.ts', 'as.ts', 'ur.ts', 'pt.ts', 'ru.ts', 'zh.ts', 'fr.ts', 'es.ts', 'ar.ts'
];

localeFiles.forEach((file) => {
  const filePath = path.join(__dirname, '../src/i18n/locales', file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const langCode = file.replace('.ts', '');
  const existingDict = parseTsDict(content);

  let added = 0;
  masterKeys.forEach((k) => {
    if (!existingDict[k]) {
      // Use fallback value from master dict if missing
      existingDict[k] = masterDict[k];
      added++;
    }
  });

  // Re-serialize typescript file
  const keyLines = Object.keys(existingDict).map((k) => {
    const formattedKey = /^[a-zA-Z0-9_]+$/.test(k) ? k : `'${k}'`;
    return `  ${formattedKey}: ${existingDict[k]},`;
  });

  const newTsContent = `import { TranslationDictionary } from '../types';

export const ${langCode}: TranslationDictionary = {
${keyLines.join('\n')}
};
`;

  fs.writeFileSync(filePath, newTsContent, 'utf8');
  console.log(`Updated ${file}: added ${added} missing keys. Total keys now: ${Object.keys(existingDict).length}.`);
});

console.log('Locale population complete!');
