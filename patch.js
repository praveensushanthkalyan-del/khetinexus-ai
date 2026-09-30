const fs = require('fs');
let content = fs.readFileSync('src/i18n/locales/en.ts', 'utf8');
content = content.replace('};', `
  sentinel2Telemetry: 'Sentinel-2 Field Telemetry',
  geminiLiveAI: 'Gemini 3.1 Live AI',
  sovereignFarmerData: 'Sovereign Farmer Data',
  participatingNodes: 'Participating Agronomic Nodes:',
  optimalSprayWindows: 'Optimal spray windows',
  multimodalVisionDoctor: 'Multimodal vision doctor',
  sovereignDataArchitecture: 'Sovereign Farmer Data Architecture',
};`);
fs.writeFileSync('src/i18n/locales/en.ts', content);
