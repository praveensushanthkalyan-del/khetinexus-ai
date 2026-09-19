const fs = require('fs');
let content = fs.readFileSync('src/i18n/types.ts', 'utf8');
content = content.replace('}', `
  sentinel2Telemetry?: string;
  geminiLiveAI?: string;
  sovereignFarmerData?: string;
  participatingNodes?: string;
  optimalSprayWindows?: string;
  multimodalVisionDoctor?: string;
  sovereignDataArchitecture?: string;
}`);
fs.writeFileSync('src/i18n/types.ts', content);
