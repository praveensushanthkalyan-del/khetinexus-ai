const fs = require('fs');
let content = fs.readFileSync('src/components/AppShell.tsx', 'utf8');

// Import useCountry
content = content.replace("import { useTheme } from '../context/ThemeContext';", "import { useTheme } from '../context/ThemeContext';\nimport { useCountry } from '../context/CountryContext';");

// Inside component
content = content.replace("  const { theme, toggleTheme } = useTheme();", "  const { theme, toggleTheme } = useTheme();\n  const { countryAdapter } = useCountry();");

// Replace currentLangObj
content = content.replace("  const currentLangObj = INDIA_LANGUAGES.find((l) => l.code === language || l.id === language) || INDIA_LANGUAGES[0];", "  const currentLangObj = countryAdapter.supportedLanguages.find((l) => l.code === language || (l as any).id === language) || countryAdapter.supportedLanguages[0];");

// Replace the language dropdown mapping
content = content.replace(/INDIA_LANGUAGES\.map\(\(lang\)/g, "countryAdapter.supportedLanguages.map((lang)");

// Update the "22 Official Languages" text to dynamic
content = content.replace(/<span>22 Official Languages<\/span>/g, "<span>{countryAdapter.countryName} Languages</span>");

// Fix the flag access in the language map (since supportedLanguages has shortCode but not always flag directly inside AppShell typing, we can fallback to adapter flag)
content = content.replace(/<span className="text-lg shrink-0">{lang\.flag}<\/span>/g, "<span className=\"text-lg shrink-0\">{(lang as any).flag || countryAdapter.flag}</span>");
content = content.replace(/<span className="text-xs shrink-0">{currentLangObj\.flag}<\/span>/g, "<span className=\"text-xs shrink-0\">{(currentLangObj as any).flag || countryAdapter.flag}</span>");

fs.writeFileSync('src/components/AppShell.tsx', content);
