/**
 * KhetiNexus Voice Live WebSocket Protocol & Typed Messages
 */

export interface VoiceFarmContextPayload {
  farmName?: string;
  location?: string;
  stateRegion?: string;
  country?: string;
  villageArea?: string;
  subDistrict?: string;
  district?: string;
  state?: string;
  crop?: string;
  cropVariety?: string;
  growthStage?: string;
  soilType?: string;
  irrigationType?: string;
  farmSize?: string;
  temperature?: string;
  humidity?: string;
  rainfall?: string;
  windSpeed?: string;
  weatherCondition?: string;
  forecastSummary?: string;
  soilPh?: string | number;
  soilNitrogen?: string;
  soilPhosphorus?: string;
  soilPotassium?: string;
  soilMoisture?: string;
  organicMatter?: string;
  soilSummary?: string;
  deficiencies?: string[];
  soilRegenerativePractices?: string[];
  advisorySummary?: string;
  todayAction?: string;
  waterManagement?: string;
  cropProtection?: string;
  regenerativePractice?: string;
  next7Days?: string;
  recentDiagnosis?: {
    condition: string;
    category?: string;
    visualConfidence?: string;
    symptoms?: string[];
    immediateActions?: string[];
  } | null;
}

export interface VoiceChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Client -> Server messages
export type ClientVoiceMessage =
  | {
      type: 'voice_request';
      requestId: string;
      language: string;
      question: string;
      farmContext?: VoiceFarmContextPayload;
      chatHistory?: VoiceChatMessage[];
    }
  | {
      type: 'cancel';
      requestId: string;
    }
  | {
      type: 'ping';
    };

// Server -> Client messages
export type ServerVoiceMessage =
  | {
      type: 'answer_start';
      requestId: string;
    }
  | {
      type: 'answer_text';
      requestId: string;
      text: string;
      delta?: string;
      done?: boolean;
    }
  | {
      type: 'audio_chunk';
      requestId: string;
      sequence: number;
      data: string; // base64 audio payload
      mimeType: string;
      final?: boolean;
    }
  | {
      type: 'audio_end';
      requestId: string;
    }
  | {
      type: 'answer_end';
      requestId: string;
      fullText: string;
      provider: string;
    }
  | {
      type: 'error';
      requestId: string;
      message: string;
    }
  | {
      type: 'pong';
    };
