import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();

  // Increase payload limit for image uploads (crop diagnosis)
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Centralized Error Handler for Gemini API responses (429, 500, 502, 503, 400)
  function handleGeminiError(res: express.Response, err: any, featureName: string) {
    console.error(`Gemini error in ${featureName}:`, err);
    const errMsg = String(err?.message || '');
    const status = Number(err?.status || err?.code || 0);

    let httpStatus = 500;
    let userMessage = `${featureName} service is temporarily unavailable. Please try again.`;

    if (status === 429 || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      httpStatus = 429;
      userMessage = 'High request volume on AI service. Please wait a few moments and try again.';
    } else if (status === 503 || errMsg.includes('503') || errMsg.includes('UNAVAILABLE')) {
      httpStatus = 503;
      userMessage = 'AI service is temporarily experiencing high demand. Please retry in a few moments.';
    } else if (status === 502 || errMsg.includes('502')) {
      httpStatus = 502;
      userMessage = 'AI upstream gateway error. Please try again in a moment.';
    } else if (status === 500 || errMsg.includes('500') || errMsg.includes('INTERNAL')) {
      httpStatus = 500;
      userMessage = 'AI service internal processing error. Please retry.';
    } else if (status === 400 || errMsg.includes('INVALID_ARGUMENT') || errMsg.includes('Unable to process input image')) {
      httpStatus = 400;
      userMessage = 'Image could not be analyzed by AI vision. Please provide a clear, well-lit crop or leaf photo.';
    }

    res.status(httpStatus).json({
      error: userMessage,
      statusCode: httpStatus,
      isTransient: httpStatus === 429 || httpStatus >= 500,
    });
  }

  // Resilient Gemini Execution Helper with automatic failover during transient spikes
  async function callGeminiWithFallback(ai: GoogleGenAI, payload: any) {
    try {
      return await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        ...payload,
      });
    } catch (err: any) {
      const errMsg = String(err?.message || '');
      const status = Number(err?.status || err?.code || 0);
      const isTransient =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        errMsg.includes('429') ||
        errMsg.includes('500') ||
        errMsg.includes('502') ||
        errMsg.includes('503') ||
        errMsg.includes('504') ||
        errMsg.includes('RESOURCE_EXHAUSTED') ||
        errMsg.includes('high demand') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('overloaded');

      if (isTransient) {
        console.warn('Primary model gemini-3.8-flash hit transient error or capacity, falling back to gemini-3.1-flash-lite...');
        try {
          return await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            ...payload,
          });
        } catch (fallbackErr: any) {
          console.error('Fallback model also encountered error:', fallbackErr);
          throw fallbackErr;
        }
      }
      throw err;
    }
  }

  // API Status & Configuration Route
  app.get('/api/health', (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
    res.json({
      status: 'ok',
      hasGeminiKey: hasKey,
      geminiKeyConfigured: hasKey,
      appName: 'KhetiNexus AI',
      version: '1.0.0-hackathon',
      modelUsed: 'gemini-3.8-flash / gemini-3.1-flash-lite',
    });
  });

  // 1. AI Agricultural Advisory Endpoint
  app.post('/api/advisory', async (req, res) => {
    try {
      const {
        location,
        crop,
        growthStage,
        soilType,
        soilMoisture,
        recentRainfall,
        temperature,
        irrigation,
        farmSize,
        country = 'India',
        language = 'en',
      } = req.body;

      if (!crop || !location) {
        res.status(400).json({ error: 'Crop and Location are required fields.' });
        return;
      }

      const ai = getGeminiClient();

      if (!ai) {
        // High quality fallback demo response when no GEMINI_API_KEY is configured
        const isHindi = language === 'hi';
        res.json({
          isDemo: true,
          source: 'Demo Advisory Engine (Configure GEMINI_API_KEY in Secrets for live AI)',
          summary: isHindi
            ? `${location} (${crop}) के लिए प्रारंभिक मृदा नमी एवं मौसमी स्थिति के अनुसार अनुकूलित सलाह।`
            : `Tailored regenerative advisory for ${crop} at ${growthStage || 'Vegetative'} stage in ${location}, ${country}.`,
          todayAction: isHindi
            ? 'पौधों की जड़ के पास 5-7 सेमी गहराई तक नमी की जांच करें। दोपहर की तेज धूप में अतिरिक्त पानी न दें।'
            : `Inspect field borders and check soil moisture at 5-7cm root depth. Avoid midday overhead watering to prevent heat scald and fungal spores.`,
          waterManagement: isHindi
            ? `हाल की वर्षा (${recentRainfall || '12'} मिमी) को देखते हुए अगले 48 घंटे ड्रिप सिंचाई को 25% कम करें।`
            : `Accounting for recent precipitation (${recentRainfall || '10-15'}mm) and temperature (${temperature || '28'}°C), reduce irrigation run time by 25%. Maintain targeted root-zone delivery.`,
          soilHealth: isHindi
            ? `${soilType || 'दोमट'} मिट्टी में सूक्ष्मजीवी गतिविधि बढ़ाने के लिए 2 टन/एकड़ वर्मीकम्पोस्ट या जीवामृत का हल्का छिड़काव करें।`
            : `For ${soilType || 'Loam'} soil, apply 1.5-2 tons/ha of aged compost or fermented bio-inoculant. Protect topsoil organic carbon from high surface heat.`,
          cropProtection: isHindi
            ? 'शुरुआती माहू (aphids) या लीफ हॉपर की निगरानी के लिए प्रति एकड़ 4-6 पीले स्टिकी ट्रैप लगाएं। रासायनिक कीटनाशक से बचें।'
            : `Install 4-6 yellow/blue sticky traps per hectare to scout early pest vectors. Prefer neem kernel extract (5%) spray over broad-spectrum synthetic pesticides.`,
          regenerativePractice: isHindi
            ? 'कतारों के बीच दलहनी फसल या घास की मल्चिंग (आच्छादन) बिछाएं। इससे 35% पानी की बचत होगी और केंचुओं की वृद्धि होगी।'
            : `Apply an organic mulch layer (3-4 inches crop residue) between planting rows. Enhances beneficial fungal mycorrhizae and reduces evaporative water loss by ~35%.`,
          next7Days: isHindi
            ? 'दिन 2-3: मल्च की स्थिति देखें। दिन 4-5: जड़ वृद्धि की जांच। दिन 6-7: बायो-उर्वरक की दूसरी हल्की खुराक।'
            : `Days 1-2: Field perimeter monitoring. Days 3-4: Verify soil moisture holding. Days 5-7: Prepare intercrop companion planting seedlings.`,
          disclaimer:
            'AI-generated guidance based on agronomic models. Always consult your local certified agricultural extension specialist for critical input decisions.',
        });
        return;
      }

      const prompt = `You are the lead agronomic AI specialist for "KhetiNexus AI - Intelligent Agriculture. Regenerative Future".
Provide a practical, farmer-friendly, highly localized agricultural advisory for a farmer with the following conditions:

- Country: ${country}
- Location: ${location}
- Crop: ${crop}
- Growth Stage: ${growthStage || 'Vegetative'}
- Soil Type: ${soilType || 'Loam'}
- Soil Moisture: ${soilMoisture || 'Medium'}
- Recent Rainfall: ${recentRainfall || '10mm'}
- Temperature: ${temperature || '27°C'}
- Irrigation Availability: ${irrigation || 'Drip/Canal'}
- Farm Size: ${farmSize || '2 hectares'}
- Output Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}

Provide concrete regenerative agriculture practices suitable for this crop and region.
Keep sentences concise, respectful, and easy for a smallholder farmer to act on.

Respond STRICTLY in valid JSON matching this schema:
{
  "summary": "Short 1-2 sentence executive summary",
  "todayAction": "Concrete immediate steps for today",
  "waterManagement": "Precise watering/irrigation guidance taking rainfall into account",
  "soilHealth": "Soil microbiome, moisture retention, and nutrient guidance",
  "cropProtection": "Biological/integrated pest management and natural disease prevention",
  "regenerativePractice": "Specific regenerative practice (e.g. cover crops, mulching, biochar, compost)",
  "next7Days": "A clear chronological action roadmap for the next 7 days",
  "disclaimer": "AI-assisted guidance advisory note"
}`;

      const response = await callGeminiWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction:
            'You are an expert agronomist specializing in regenerative agriculture and smallholder farming in BRICS nations.',
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      res.json({
        isDemo: false,
        source: 'Google Gemini Live AI',
        ...parsed,
      });
    } catch (err: any) {
      handleGeminiError(res, err, 'AI Advisory');
    }
  });

  // 2. AI Crop Doctor / Disease Diagnosis Endpoint
  app.post('/api/diagnose', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', crop, symptoms, language = 'en' } = req.body;

      if (!imageBase64) {
        res.status(400).json({ error: 'Image data is required.' });
        return;
      }

      const ai = getGeminiClient();

      if (!ai) {
        // Fallback demo diagnosis when key is not yet configured
        res.json({
          isDemo: true,
          source: 'Demo Diagnosis Engine (Configure GEMINI_API_KEY in Secrets for live vision AI)',
          disease: crop === 'Wheat' ? 'Yellow Rust (Puccinia striiformis)' : 'Early Blight (Alternaria solani)',
          confidence: 'Moderate (Demo Mode)',
          visibleSymptoms: 'Concentric brown rings with chlorotic halo observed on lower leaf surface.',
          causes: 'Prolonged leaf wetness exceeding 8 hours combined with ambient temperatures between 22-28°C.',
          immediateActions: 'Prune severely infected lower leaves. Refrain from overhead sprinkling. Apply organic copper or trichoderma bio-fungicide.',
          preventionPractices: 'Practice 3-year crop rotation with non-host species, maintain adequate plant spacing for airflow, and apply compost tea to build leaf surface microbiome.',
          isReliable: true,
          disclaimer: 'AI-assisted diagnosis for informational purposes. Confirm with local agricultural extension officers before applying chemical treatments.',
        });
        return;
      }

      // Remove data URL prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

      const prompt = `You are "KhetiNexus Crop Doctor", an expert plant pathologist and agronomist.
Examine this crop leaf/plant image carefully.
Crop species indicated: ${crop || 'Unspecified plant'}
Reported symptoms: ${symptoms || 'None provided'}
Output Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}

CRITICAL INSTRUCTION:
If the image quality is poor, blurry, unrelated to agriculture/plants, or if the disease cannot be reliably identified, you MUST set "isReliable" to false and set "disease" to:
"Unable to determine reliably from this image."
Do not invent or hallucinate a disease.

If the plant is healthy, clearly state "Healthy Plant - No Disease Detected".
If a plant disease, nutrient deficiency, or pest damage is identified, provide realistic and organic/regenerative treatment advice.

Respond strictly in valid JSON matching this schema:
{
  "isReliable": boolean,
  "disease": "Name of disease or 'Unable to determine reliably from this image.'",
  "confidence": "High" | "Moderate" | "Low",
  "visibleSymptoms": "Detailed visual signs visible on the leaf/stem",
  "causes": "Environmental, fungal, bacterial, viral, or pest causes",
  "immediateActions": "Immediate safe remediation steps",
  "preventionPractices": "Regenerative prevention and long-term soil/plant immunity practices",
  "disclaimer": "Mandatory disclaimer stating diagnosis is AI-assisted and should be confirmed by a local agricultural expert."
}`;

      const response = await callGeminiWithFallback(ai, {
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType === 'image/svg+xml' ? 'image/png' : (mimeType || 'image/jpeg'),
                data: cleanBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          systemInstruction:
            'You are an authoritative agricultural pathologist with high standards of diagnostic accuracy. Never invent diseases.',
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      res.json({
        isDemo: false,
        source: 'Google Gemini Live Vision AI',
        ...parsed,
      });
    } catch (err: any) {
      handleGeminiError(res, err, 'Crop Doctor');
    }
  });

  // 3. AI Soil Health Analysis Endpoint
  app.post('/api/soil-analysis', async (req, res) => {
    try {
      const {
        soilType,
        ph,
        nitrogen,
        phosphorus,
        potassium,
        soilMoisture,
        organicMatter,
        crop,
        country = 'India',
        language = 'en',
      } = req.body;

      const ai = getGeminiClient();

      if (!ai) {
        // High quality fallback
        const phVal = Number(ph) || 6.8;
        const omVal = Number(organicMatter) || 1.8;
        res.json({
          isDemo: true,
          source: 'Demo Soil Diagnostic Engine (Configure GEMINI_API_KEY in Secrets for live AI)',
          summary: `Soil pH is ${phVal.toFixed(1)} (${phVal < 6.0 ? 'Acidic' : phVal > 7.5 ? 'Alkaline' : 'Near-optimal'}). Soil organic matter is ${omVal}%, which has great potential for carbon sequestration.`,
          deficiencies: [
            phVal > 7.5 ? 'Slight micronutrient lockout due to high alkalinity' : 'Moderate nitrogen replenishment advised',
            omVal < 2.0 ? 'Low organic carbon buffer capacity' : 'Optimal microbial substrate',
          ],
          regenerativeRecommendations: [
            'Introduce deep-rooted multi-species cover crops (sunn hemp + rye) during fallow periods.',
            'Incorporate 3 tons/hectare of biochar inoculated with compost tea to stabilize carbon.',
            'Adopt zero-till or strip-till practices to preserve mycorrhizal networks.',
          ],
          organicMatterSuggestions: 'Apply green manure or vermicompost before the next sowing window to elevate organic matter above 2.5%.',
          cropSpecificAdvice: `For ${crop || 'field crops'}, maintain balanced N-P-K ratios with slow-release organic meals rather than concentrated synthetic salts.`,
          disclaimer: 'AI-generated soil health evaluation based on general agronomic thresholds. Always calibrate with standard laboratory soil tests.',
        });
        return;
      }

      const prompt = `You are a regenerative soil scientist for "KhetiNexus AI".
Analyze the following soil test values for a farm in ${country} cultivating ${crop || 'general crops'}:

- Soil Type: ${soilType || 'Loam'}
- Soil pH: ${ph || '6.5'}
- Nitrogen (N): ${nitrogen || 'Medium'}
- Phosphorus (P): ${phosphorus || 'Medium'}
- Potassium (K): ${potassium || 'Medium'}
- Soil Moisture: ${soilMoisture || '50%'}
- Soil Organic Matter: ${organicMatter || '1.8%'}
- Output Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}

Generate an easy-to-understand soil health breakdown with regenerative practices to restore biological vitality.

Respond STRICTLY in valid JSON matching this schema:
{
  "summary": "Plain-language summary of the soil condition",
  "deficiencies": ["List of key deficiencies or imbalances"],
  "regenerativeRecommendations": ["List of actionable regenerative methods"],
  "organicMatterSuggestions": "Specific instructions on how to naturally increase organic matter",
  "cropSpecificAdvice": "Guidance on how this soil affects the target crop",
  "disclaimer": "Standard soil testing disclaimer"
}`;

      const response = await callGeminiWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an expert regenerative soil scientist and agroecologist.',
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      res.json({
        isDemo: false,
        source: 'Google Gemini Live Soil AI',
        ...parsed,
      });
    } catch (err: any) {
      handleGeminiError(res, err, 'Soil Analysis');
    }
  });

  // 4. Weather Data Endpoint (Configurable with fallback demo weather layer)
  app.get('/api/weather', (req, res) => {
    const location = (req.query.location as string) || 'Punjab, India';
    const country = (req.query.country as string) || 'India';

    // Simulated realistic localized weather data based on country/location
    let temp = 28;
    let humidity = 65;
    let rainfall = '12 mm';
    let wind = '14 km/h SW';
    let condition = 'Partly Cloudy';
    let conditionCode = 'partly-cloudy';

    if (country === 'Russia') {
      temp = 16;
      humidity = 58;
      rainfall = '4 mm';
      wind = '18 km/h NW';
      condition = 'Clear & Mild';
      conditionCode = 'clear';
    } else if (country === 'Brazil') {
      temp = 31;
      humidity = 78;
      rainfall = '24 mm';
      wind = '10 km/h E';
      condition = 'Scattered Showers';
      conditionCode = 'rain';
    } else if (country === 'China') {
      temp = 24;
      humidity = 62;
      rainfall = '8 mm';
      wind = '12 km/h NE';
      condition = 'Overcast';
      conditionCode = 'cloudy';
    } else if (country === 'South Africa') {
      temp = 26;
      humidity = 45;
      rainfall = '0 mm';
      wind = '22 km/h SE';
      condition = 'Sunny & Dry';
      conditionCode = 'sunny';
    }

    const forecast = [
      { day: 'Tomorrow', temp: `${temp + 1}°C`, condition: 'Sunny', rainProb: '10%' },
      { day: 'Day 2', temp: `${temp}°C`, condition: 'Partly Cloudy', rainProb: '25%' },
      { day: 'Day 3', temp: `${temp - 2}°C`, condition: 'Chance of Rain', rainProb: '60%' },
      { day: 'Day 4', temp: `${temp - 1}°C`, condition: 'Showers', rainProb: '75%' },
      { day: 'Day 5', temp: `${temp + 1}°C`, condition: 'Clear', rainProb: '15%' },
    ];

    res.json({
      location,
      country,
      temperature: `${temp}°C`,
      tempValue: temp,
      humidity: `${humidity}%`,
      rainfall,
      wind,
      condition,
      conditionCode,
      forecast,
      isDemo: true,
      notice: 'Demo Weather Layer (Configurable for OpenWeather / national meteorological APIs)',
    });
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KhetiNexus AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
