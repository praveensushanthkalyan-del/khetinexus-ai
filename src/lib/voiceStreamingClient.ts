import {
  ClientVoiceMessage,
  ServerVoiceMessage,
  VoiceFarmContextPayload,
  VoiceChatMessage,
} from './voiceStreamingProtocol';

export type StreamingVoiceStatus = 'idle' | 'connecting' | 'connected' | 'streaming' | 'fallback_http';

export interface VoiceStreamCallbacks {
  onStart?: (requestId: string) => void;
  onTextChunk?: (requestId: string, fullText: string, delta: string) => void;
  onAudioChunk?: (requestId: string, sequence: number, data: string, mimeType: string) => void;
  onAudioEnd?: (requestId: string) => void;
  onAudioPlaybackEnded?: (requestId: string) => void;
  onAnswerEnd?: (requestId: string, fullText: string, provider: string) => void;
  onError?: (requestId: string, message: string) => void;
  onFallback?: (reason: string) => void;
}

interface ActiveAudioRecord {
  requestId: string;
  sourceNode?: AudioBufferSourceNode;
  gainNode?: GainNode;
  audioElement?: HTMLAudioElement;
  objectUrl?: string;
  isAudioContext: boolean;
}

/**
 * Creates a valid WAV Blob from either a base64 string that is already WAV
 * or a raw PCM / L16 16-bit signed little-endian audio stream.
 */
export function createWavFromPcm(
  base64Data: string,
  sampleRate = 24000,
  channels = 1,
  bitsPerSample = 16
): { blob: Blob; bytes: Uint8Array; isWavContainerCreated: boolean; formatDetected: string } {
  const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const binaryString = window.atob(cleanBase64);
  const len = binaryString.length;
  const rawBytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    rawBytes[i] = binaryString.charCodeAt(i);
  }

  // Check if it already has valid RIFF and WAVE signatures
  const isAlreadyWav =
    rawBytes.length >= 12 &&
    rawBytes[0] === 0x52 && rawBytes[1] === 0x49 && rawBytes[2] === 0x46 && rawBytes[3] === 0x46 && // "RIFF"
    rawBytes[8] === 0x57 && rawBytes[9] === 0x41 && rawBytes[10] === 0x56 && rawBytes[11] === 0x45;  // "WAVE"

  if (isAlreadyWav) {
    const blob = new Blob([rawBytes], { type: 'audio/wav' });
    return {
      blob,
      bytes: rawBytes,
      isWavContainerCreated: false,
      formatDetected: 'audio/wav (RIFF/WAVE header verified)',
    };
  }

  // Construct WAV container from raw PCM
  const pcmSize = rawBytes.length;
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const headerBuffer = new ArrayBuffer(44);
  const view = new DataView(headerBuffer);

  // RIFF header
  view.setUint8(0, 0x52); // 'R'
  view.setUint8(1, 0x49); // 'I'
  view.setUint8(2, 0x46); // 'F'
  view.setUint8(3, 0x46); // 'F'
  view.setUint32(4, 36 + pcmSize, true); // Little-endian
  view.setUint8(8, 0x57); // 'W'
  view.setUint8(9, 0x41); // 'A'
  view.setUint8(10, 0x56); // 'V'
  view.setUint8(11, 0x45); // 'E'

  // fmt subchunk
  view.setUint8(12, 0x66); // 'f'
  view.setUint8(13, 0x6d); // 'm'
  view.setUint8(14, 0x74); // 't'
  view.setUint8(15, 0x20); // ' '
  view.setUint32(16, 16, true); // Subchunk1Size = 16 for PCM
  view.setUint16(20, 1, true); // AudioFormat = 1 (PCM)
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data subchunk
  view.setUint8(36, 0x64); // 'd'
  view.setUint8(37, 0x61); // 'a'
  view.setUint8(38, 0x74); // 't'
  view.setUint8(39, 0x61); // 'a'
  view.setUint32(40, pcmSize, true);

  const wavBytes = new Uint8Array(44 + pcmSize);
  wavBytes.set(new Uint8Array(headerBuffer), 0);
  wavBytes.set(rawBytes, 44);

  const blob = new Blob([wavBytes], { type: 'audio/wav' });
  return {
    blob,
    bytes: wavBytes,
    isWavContainerCreated: true,
    formatDetected: `raw PCM/L16 (${sampleRate}Hz, ${channels}ch, ${bitsPerSample}bit) -> converted to WAV`,
  };
}

function parseSampleRateFromMime(mimeType?: string, defaultRate = 24000): number {
  if (!mimeType) return defaultRate;
  const match = mimeType.match(/rate=(\d+)/i);
  if (match && match[1]) {
    const parsed = parseInt(match[1], 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return defaultRate;
}

export class VoiceStreamingClient {
  private ws: WebSocket | null = null;
  private activeRequestId: string | null = null;
  private callbacks: Map<string, VoiceStreamCallbacks> = new Map();
  private isConnecting: boolean = false;
  private isMuted: boolean = false;
  private pingInterval: number | null = null;
  private audioContext: AudioContext | null = null;
  private activeAudioRecords: ActiveAudioRecord[] = [];
  private audioChunksMap: Map<string, { sequence: number; data: string; mimeType: string }[]> = new Map();
  private playedRequests: Set<string> = new Set();
  private fallbackMode: boolean = false;

  constructor() {
    // Lazy AudioContext initialization upon user action
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.audioContext || this.audioContext.state === 'closed') {
      try {
        this.audioContext = new AudioCtx();
      } catch (e) {
        console.warn('[VoiceStreamingClient] Could not initialize AudioContext:', e);
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  public connect(): Promise<boolean> {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return Promise.resolve(false);
    }
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return Promise.resolve(true);
    }

    this.isConnecting = true;

    return new Promise((resolve) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws/voice`;

        const socket = new WebSocket(wsUrl);
        this.ws = socket;

        const connectionTimeout = window.setTimeout(() => {
          if (socket.readyState !== WebSocket.OPEN) {
            this.isConnecting = false;
            this.fallbackMode = true;
            resolve(false);
          }
        }, 5000);

        socket.onopen = () => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          this.fallbackMode = false;

          // Start heartbeat ping
          if (this.pingInterval) clearInterval(this.pingInterval);
          this.pingInterval = window.setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({ type: 'ping' }));
            }
          }, 25000);

          resolve(true);
        };

        socket.onmessage = (event) => {
          try {
            const data: ServerVoiceMessage = JSON.parse(event.data);
            this.handleServerMessage(data);
          } catch (e) {
            console.warn('[VoiceStreamingClient] Error parsing incoming WS message:', e);
          }
        };

        socket.onerror = () => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          this.fallbackMode = true;
          resolve(false);
        };

        socket.onclose = () => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
          }
        };
      } catch (err) {
        this.isConnecting = false;
        this.fallbackMode = true;
        resolve(false);
      }
    });
  }

  public isSocketReady(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN && !this.fallbackMode;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    for (const record of this.activeAudioRecords) {
      if (record.gainNode) {
        record.gainNode.gain.value = muted ? 0 : 1;
      }
      if (record.audioElement) {
        record.audioElement.muted = muted;
        record.audioElement.volume = muted ? 0 : 1;
      }
    }
  }

  public pausePlayback() {
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend().catch(() => {});
    }
    for (const record of this.activeAudioRecords) {
      if (record.audioElement && !record.audioElement.paused) {
        record.audioElement.pause();
      }
    }
  }

  public resumePlayback() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    for (const record of this.activeAudioRecords) {
      if (record.audioElement && record.audioElement.paused && record.audioElement.currentTime > 0 && record.audioElement.currentTime < record.audioElement.duration) {
        record.audioElement.play().catch(() => {});
      }
    }
  }

  public stopAudioPlayback() {
    this.audioChunksMap.clear();
    this.playedRequests.clear();

    for (const record of this.activeAudioRecords) {
      try {
        if (record.sourceNode) {
          record.sourceNode.stop();
          record.sourceNode.disconnect();
        }
        if (record.gainNode) {
          record.gainNode.disconnect();
        }
        if (record.audioElement) {
          record.audioElement.pause();
          record.audioElement.currentTime = 0;
          record.audioElement.src = '';
        }
        if (record.objectUrl) {
          URL.revokeObjectURL(record.objectUrl);
        }
      } catch (e) {}
    }
    this.activeAudioRecords = [];
  }

  public cancel(requestId?: string) {
    const idToCancel = requestId || this.activeRequestId;
    if (!idToCancel) return;

    this.stopAudioPlayback();

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const cancelMsg: ClientVoiceMessage = {
        type: 'cancel',
        requestId: idToCancel,
      };
      this.ws.send(JSON.stringify(cancelMsg));
    }

    if (this.activeRequestId === idToCancel) {
      this.activeRequestId = null;
    }
    this.callbacks.delete(idToCancel);
  }

  public async sendQuestion(
    question: string,
    language: string,
    farmContext: VoiceFarmContextPayload,
    chatHistory: VoiceChatMessage[],
    callbacks: VoiceStreamCallbacks
  ): Promise<string> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Cancel any ongoing response
    if (this.activeRequestId) {
      this.cancel(this.activeRequestId);
    }

    this.activeRequestId = requestId;
    this.callbacks.set(requestId, callbacks);
    this.stopAudioPlayback();

    // Ensure AudioContext is primed from user gesture
    this.getAudioContext();

    const isReady = this.isSocketReady() || (await this.connect());

    if (!isReady || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      // Automatic transparent HTTP Fallback
      callbacks.onFallback?.('WebSocket unavailable, using standard voice transport');
      this.executeHttpFallback(requestId, question, language, farmContext, chatHistory, callbacks);
      return requestId;
    }

    const payload: ClientVoiceMessage = {
      type: 'voice_request',
      requestId,
      language,
      question,
      farmContext,
      chatHistory,
    };

    try {
      this.ws.send(JSON.stringify(payload));
    } catch (err) {
      callbacks.onFallback?.('Send failed, switching to standard voice mode');
      this.executeHttpFallback(requestId, question, language, farmContext, chatHistory, callbacks);
    }

    return requestId;
  }

  private async executeHttpFallback(
    requestId: string,
    question: string,
    language: string,
    farmContext: VoiceFarmContextPayload,
    chatHistory: VoiceChatMessage[],
    callbacks: VoiceStreamCallbacks
  ) {
    try {
      callbacks.onStart?.(requestId);

      const res = await fetch('/api/voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: question,
          language,
          farmContext,
          includeAudio: true,
          chatHistory,
        }),
      });

      if (!res.ok) {
        throw new Error(`Voice HTTP response status ${res.status}`);
      }

      const data = await res.json();
      if (data.text) {
        callbacks.onTextChunk?.(requestId, data.text, data.text);
        if (data.audioBase64) {
          callbacks.onAudioChunk?.(requestId, 0, data.audioBase64, 'audio/wav');
          if (!this.audioChunksMap.has(requestId)) {
            this.audioChunksMap.set(requestId, []);
          }
          this.audioChunksMap.get(requestId)!.push({
            sequence: 0,
            data: data.audioBase64,
            mimeType: 'audio/wav',
          });
          this.playCompleteAudio(requestId);
        }
        callbacks.onAudioEnd?.(requestId);
        callbacks.onAnswerEnd?.(requestId, data.text, data.provider || 'KhetiNexus Voice AI');
      } else {
        throw new Error('Empty response from Voice Agent');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      callbacks.onError?.(requestId, msg);
    }
  }

  private handleServerMessage(msg: ServerVoiceMessage) {
    if (msg.type === 'pong') return;

    const reqId = msg.requestId;
    if (this.activeRequestId && reqId !== this.activeRequestId) {
      // Stale or cancelled request chunk, ignore cleanly
      return;
    }

    const cb = this.callbacks.get(reqId);

    switch (msg.type) {
      case 'answer_start':
        cb?.onStart?.(reqId);
        break;

      case 'answer_text':
        cb?.onTextChunk?.(reqId, msg.text, msg.delta || '');
        break;

      case 'audio_chunk': {
        cb?.onAudioChunk?.(reqId, msg.sequence, msg.data, msg.mimeType || 'audio/wav');

        if (!this.audioChunksMap.has(reqId)) {
          this.audioChunksMap.set(reqId, []);
        }
        this.audioChunksMap.get(reqId)!.push({
          sequence: msg.sequence,
          data: msg.data,
          mimeType: msg.mimeType || 'audio/wav',
        });

        if (msg.final) {
          this.playCompleteAudio(reqId);
        }
        break;
      }

      case 'audio_end':
        cb?.onAudioEnd?.(reqId);
        this.playCompleteAudio(reqId);
        break;

      case 'answer_end':
        this.playCompleteAudio(reqId);
        cb?.onAnswerEnd?.(reqId, msg.fullText, msg.provider);
        break;

      case 'error':
        cb?.onError?.(reqId, msg.message);
        break;
    }
  }

  private async playCompleteAudio(requestId: string) {
    if (this.activeRequestId !== requestId) return;
    if (this.playedRequests.has(requestId)) return;

    const chunks = this.audioChunksMap.get(requestId);
    if (!chunks || chunks.length === 0) return;

    this.playedRequests.add(requestId);

    // Concatenate BASE64 strings in sequence order first
    const combinedBase64 = chunks
      .sort((a, b) => a.sequence - b.sequence)
      .map((chunk) => chunk.data)
      .join('');

    const rawMimeType = chunks[0]?.mimeType || 'audio/wav';
    const sampleRate = parseSampleRateFromMime(rawMimeType, 24000);

    try {
      // Decode base64 and wrap PCM in WAV container if needed
      const wavResult = createWavFromPcm(combinedBase64, sampleRate, 1, 16);
      const objectUrl = URL.createObjectURL(wavResult.blob);

      console.info('[VoiceStreamingClient] Audio MIME:', rawMimeType);
      console.info('[VoiceStreamingClient] Audio bytes:', wavResult.bytes.length);
      console.info('[VoiceStreamingClient] Audio format:', wavResult.formatDetected);
      console.info('[VoiceStreamingClient] WAV container created:', wavResult.isWavContainerCreated);

      const audioCtx = this.getAudioContext();

      // Primary robust Web Audio Context playback
      if (audioCtx) {
        try {
          const arrayBuffer = new ArrayBuffer(wavResult.bytes.byteLength);
          new Uint8Array(arrayBuffer).set(wavResult.bytes);

          // Resume audioContext if suspended
          if (audioCtx.state === 'suspended') {
            await audioCtx.resume().catch(() => {});
          }

          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

          if (this.activeRequestId !== requestId) {
            URL.revokeObjectURL(objectUrl);
            return;
          }

          const sourceNode = audioCtx.createBufferSource();
          sourceNode.buffer = audioBuffer;

          const gainNode = audioCtx.createGain();
          gainNode.gain.value = this.isMuted ? 0 : 1;

          sourceNode.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          const record: ActiveAudioRecord = {
            requestId,
            sourceNode,
            gainNode,
            objectUrl,
            isAudioContext: true,
          };
          this.activeAudioRecords.push(record);

          console.info('[VoiceStreamingClient] Audio duration/playback started:', {
            requestId,
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            engine: 'WebAudio',
          });

          const cleanup = () => {
            const idx = this.activeAudioRecords.indexOf(record);
            if (idx > -1) {
              this.activeAudioRecords.splice(idx, 1);
            }
            try {
              sourceNode.disconnect();
              gainNode.disconnect();
              URL.revokeObjectURL(objectUrl);
            } catch (e) {}
          };

          sourceNode.onended = () => {
            console.info('[VoiceStreamingClient] WAV playback ended', { requestId });
            cleanup();
            const cb = this.callbacks.get(requestId);
            cb?.onAudioPlaybackEnded?.(requestId);
          };

          sourceNode.start(0);
          return;
        } catch (ctxErr) {
          console.warn('[VoiceStreamingClient] WebAudio decode failed, falling back to HTMLAudioElement:', ctxErr);
        }
      }

      // Fallback HTMLAudioElement playback
      const audio = new Audio(objectUrl);
      audio.muted = this.isMuted;
      audio.volume = this.isMuted ? 0 : 1;

      const record: ActiveAudioRecord = {
        requestId,
        audioElement: audio,
        objectUrl,
        isAudioContext: false,
      };
      this.activeAudioRecords.push(record);

      const cleanup = () => {
        const idx = this.activeAudioRecords.indexOf(record);
        if (idx > -1) {
          this.activeAudioRecords.splice(idx, 1);
        }
        try {
          URL.revokeObjectURL(objectUrl);
        } catch (e) {}
      };

      audio.onended = () => {
        console.info('[VoiceStreamingClient] WAV playback ended', { requestId });
        cleanup();
        const cb = this.callbacks.get(requestId);
        cb?.onAudioPlaybackEnded?.(requestId);
      };

      audio.onerror = (e) => {
        console.error('[VoiceStreamingClient] HTMLAudioElement playback error', {
          requestId,
          error: audio.error || e,
        });
        cleanup();
        const cb = this.callbacks.get(requestId);
        cb?.onAudioPlaybackEnded?.(requestId);
      };

      audio.play().then(() => {
        console.info('[VoiceStreamingClient] Audio duration/playback started:', {
          requestId,
          duration: audio.duration,
          engine: 'HTMLAudioElement',
        });
      }).catch((error) => {
        if (error.name === 'NotAllowedError') {
          console.warn('[VoiceStreamingClient] Autoplay blocked by desktop browser policy. Interaction required to play audio.', {
            requestId,
            error,
          });
        } else if (error.name === 'NotSupportedError') {
          console.error('[VoiceStreamingClient] Audio format/decode error (NotSupportedError):', {
            requestId,
            error,
          });
          cleanup();
          const cb = this.callbacks.get(requestId);
          cb?.onAudioPlaybackEnded?.(requestId);
        } else {
          console.error('[VoiceStreamingClient] HTMLAudioElement playback error:', {
            requestId,
            error,
          });
          cleanup();
          const cb = this.callbacks.get(requestId);
          cb?.onAudioPlaybackEnded?.(requestId);
        }
      });
    } catch (error) {
      console.error('[VoiceStreamingClient] WAV playback preparation error', {
        requestId,
        error,
      });
      const cb = this.callbacks.get(requestId);
      cb?.onAudioPlaybackEnded?.(requestId);
    }
  }

  public disconnect() {
    this.stopAudioPlayback();
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    this.callbacks.clear();
    this.activeRequestId = null;
  }
}

// Global Singleton Instance
export const voiceStreamingClient = new VoiceStreamingClient();
