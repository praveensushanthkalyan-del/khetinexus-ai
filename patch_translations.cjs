const fs = require('fs');
let content = fs.readFileSync('src/i18n/translations.ts', 'utf8');

if (!content.includes('import { ru } from')) {
    content = content.replace("import { ur } from './locales/ur';", "import { ur } from './locales/ur';\nimport { pt } from './locales/pt';\nimport { ru } from './locales/ru';\nimport { zh } from './locales/zh';");
}

if (!content.includes('ru,')) {
    content = content.replace("  ur,", "  ur,\n  pt,\n  ru,\n  zh,");
}

fs.writeFileSync('src/i18n/translations.ts', content);
