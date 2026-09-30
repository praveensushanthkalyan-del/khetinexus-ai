const fs = require('fs');
let content = fs.readFileSync('src/i18n/locales/en.ts', 'utf8');
content = content.replace('};', `
  pipelineHealth: 'Pipeline Health',
  telemetryMatrix: 'Telemetry Matrix',
  live: 'LIVE',
  recent: 'RECENT',
  resolved: 'RESOLVED',
  syncing: 'Syncing...',
  syncTelemetry: 'Sync Telemetry',
  vigorousCanopyHealth: 'Vigorous Canopy Health',
  adequateRootzoneMoisture: 'Adequate Rootzone Moisture',
  intensiveCroppingZone: 'Intensive Cropping Zone',
};`);
fs.writeFileSync('src/i18n/locales/en.ts', content);

let typesContent = fs.readFileSync('src/i18n/types.ts', 'utf8');
typesContent = typesContent.replace('}', `
  pipelineHealth?: string;
  telemetryMatrix?: string;
  live?: string;
  recent?: string;
  resolved?: string;
  syncing?: string;
  syncTelemetry?: string;
  vigorousCanopyHealth?: string;
  adequateRootzoneMoisture?: string;
  intensiveCroppingZone?: string;
}`);
fs.writeFileSync('src/i18n/types.ts', typesContent);
