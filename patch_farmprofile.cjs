const fs = require('fs');
let content = fs.readFileSync('src/components/FarmProfileView.tsx', 'utf8');

// Remove presets UI block completely
content = content.replace(/\{\/\* Preset Selector \*\/\}.*?(?=\{\/\* Main Farm Profile Form \*\/\})/s, "");

// Make country read-only and remove all the India hardcoding
const countryInputRegex = /<div>\s*<label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1\.5">\s*\{t\.country\} \*\s*<\/label>\s*<select\s*id="select-country"[\s\S]*?<\/select>\s*<\/div>/g;

content = content.replace(countryInputRegex, `<div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.country} *
              </label>
              <input
                type="text"
                readOnly
                value={activeCountry}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 cursor-not-allowed opacity-80 min-h-[44px]"
              />
            </div>`);

// Also need to get activeCountry from CountryContext inside FarmProfileView.
if (!content.includes('import { useCountry } from')) {
    content = content.replace("import { useAuth } from '../context/AuthContext';", "import { useAuth } from '../context/AuthContext';\nimport { useCountry } from '../context/CountryContext';");
}
if (!content.includes('const { activeCountry } = useCountry();')) {
    content = content.replace("  const t = getTranslation(language);", "  const t = getTranslation(language);\n  const { activeCountry } = useCountry();");
}

fs.writeFileSync('src/components/FarmProfileView.tsx', content);
