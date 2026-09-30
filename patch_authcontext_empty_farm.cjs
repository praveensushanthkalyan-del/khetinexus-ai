const fs = require('fs');
let content = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');

// Replace EMPTY_FARM_PROFILE usage with dynamic creation using activeCountry
content = content.replace("      ? userFarmToFarmProfile(activeFarm)\n      : EMPTY_FARM_PROFILE", "      ? userFarmToFarmProfile(activeFarm)\n      : { ...EMPTY_FARM_PROFILE, country: activeCountry, stateRegion: '', location: '' }");

fs.writeFileSync('src/context/AuthContext.tsx', content);
