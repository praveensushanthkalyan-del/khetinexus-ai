const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regexToFind = /const langName = getLanguagePromptName\(language\);[\s\S]*?(?=      const rawText = response\.text \|\| '\{\}';)/g;

let matches = code.match(regexToFind);

// The first match is the one we accidentally replaced with Crop Doctor.
// We need to restore it to the Advisory prompt.

const restoredAdvisory = `const langName = getLanguagePromptName(language);
      const prompt = \`You are an expert agronomist providing concise, practical, regenerative agriculture guidance for farmers.
Current Context:
Crop: \${crop}
Growth Stage: \${growthStage}
Farm Location: \${location}, \${country}
Farm Size: \${farmSize} hectares
Soil Type: \${soilType}
Temperature: \${temperature}°C
Condition: \${condition}
Humidity: \${humidity}%
Recent Rainfall: \${recentRainfall} mm
Farming Practice: \${farmingPractice}

Target Output Language: \${langName}.

MANDATORY LANGUAGE INSTRUCTION:
Respond entirely in the requested output language: \${langName}.
Do not use English unless the requested language is English.
Keep scientific names, metric units (Celsius, mm, hectares), and locations in their standard format, but all descriptive fields MUST be fully, accurately, and fluently written in \${langName}.

Provide a highly actionable, daily advisory report tailored exactly to these conditions in valid JSON format matching this schema:
{
  "summary": "1 sentence high level overview in \${langName}",
  "todayAction": "The single most important action to take today in \${langName}",
  "waterManagement": "Specific irrigation/drainage advice based on rain/temp in \${langName}",
  "soilHealth": "Soil fertility recommendation for \${soilType} in \${langName}",
  "cropProtection": "Pest/disease warning based on humidity/temp in \${langName}",
  "regenerativePractice": "Specific regenerative practice (mulching, cover crops, biochar, compost) in \${langName}",
  "next7Days": "Chronological action roadmap for next 7 days in \${langName}",
  "disclaimer": "AI-assisted guidance advisory note in \${langName}"
}\`;

      const response = await callGeminiSafe(ai, {
        endpointName: 'Advisory',
        models: ['gemini-3.1-flash-lite'],
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction:
            \`You are an expert agronomist providing concise, practical, regenerative agriculture guidance for farmers. You MUST write all advisory content entirely in the requested language: \${langName}. Do not use English unless the requested language is English.\`,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
        timeoutMs: 22000,
        maxRetriesPerModel: 1,
      });

`;

code = code.replace(matches[0], restoredAdvisory);
fs.writeFileSync('server.ts', code);
