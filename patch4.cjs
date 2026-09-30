const fs = require('fs');
let content = fs.readFileSync('src/i18n/locales/en.ts', 'utf8');
content = content.replace('};', `
  bricsRegionalScalability: 'BRICS Regional Scalability',
};`);
fs.writeFileSync('src/i18n/locales/en.ts', content);

let typesContent = fs.readFileSync('src/i18n/types.ts', 'utf8');
typesContent = typesContent.replace('}', `
  bricsRegionalScalability?: string;
}`);
fs.writeFileSync('src/i18n/types.ts', typesContent);
