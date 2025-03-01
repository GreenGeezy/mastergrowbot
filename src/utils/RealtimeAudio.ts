
import { supabase } from '@/integrations/supabase/client';

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private recorder: AudioRecorder | null = null;
  private isListening = false;

  constructor(private onMessage: (message: any) => void, private onTranscript: (text: string) => void) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async init() {
    try {
      // Get ephemeral token from our Supabase Edge Function
      const tokenResponse = await supabase.functions.invoke("realtime-token");
      
      if (tokenResponse.error) {
        throw new Error(`Failed to get token: ${tokenResponse.error.message || 'Unknown error'}`);
      }
      
      const data = tokenResponse.data;
      
      if (!data?.client_secret?.value) {
        console.error('Invalid token response:', data);
        throw new Error("Failed to get ephemeral token");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log("Got ephemeral token, initializing WebRTC");

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up remote audio
      this.pc.ontrack = e => {
        console.log("Received audio track", e);
        this.audioEl.srcObject = e.streams[0];
      };

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("Received event:", event);
          
          // Extract transcript from audio transcript events
          if (event.type === 'response.audio_transcript.delta' && event.delta) {
            this.onTranscript(event.delta);
          }
          
          this.onMessage(event);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Connect to OpenAI's Realtime API
      console.log("Connecting to OpenAI Realtime API");
      const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error("SDP response error:", errorText);
        throw new Error(`Failed to connect to OpenAI: ${sdpResponse.status} ${errorText}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established");

      // Wait for data channel to open before sending session config
      this.dc.onopen = () => {
        console.log("Data channel opened, sending session config");
        this.sendSessionConfig();
      };

    } catch (error) {
      console.error("Error initializing chat:", error);
      throw error;
    }
  }

  private sendSessionConfig() {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.error('Data channel not ready');
      return;
    }

    const config = {
      "event_id": "config_" + Date.now(),
      "type": "session.update",
      "session": {
        "modalities": ["text", "audio"],
        "instructions": "You are Master Growbot, an AI assistant helping cannabis cultivators with growing advice. Answer questions helpfully, accurately, and concisely. Focus on best practices for cannabis cultivation, plant health, nutrients, and troubleshooting common issues.",
        "voice": "alloy",
        "input_audio_format": "pcm16",
        "output_audio_format": "pcm16",
        "input_audio_transcription": {
          "model": "whisper-1"
        },
        "turn_detection": {
          "type": "server_vad",
          "threshold": 0.5,
          "prefix_padding_ms": 300,
          "silence_duration_ms": 1000
        },
        "temperature": 0.8,
        "max_response_output_tokens": 150
      }
    };

    console.log("Sending session config:", config);
    this.dc.send(JSON.stringify(config));
  }

  private encodeAudioData(float32Array: Float32Array): string {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }

  startListening() {
    if (this.isListening) return;
    
    console.log("Starting listening");
    this.isListening = true;
    
    this.recorder = new AudioRecorder((audioData) => {
      if (this.dc?.readyState === 'open') {
        this.dc.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: this.encodeAudioData(audioData)
        }));
      }
    });
    
    this.recorder.start();
  }

  stopListening() {
    if (!this.isListening) return;
    
    console.log("Stopping listening");
    this.isListening = false;
    
    if (this.recorder) {
      this.recorder.stop();
      this.recorder = null;
    }
  }

  async sendMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    console.log("Sending message:", event);
    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({type: 'response.create'}));
  }

  disconnect() {
    console.log("Disconnecting");
    this.stopListening();
    this.dc?.close();
    this.pc?.close();
  }
}
