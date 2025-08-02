
import { supabase } from '@/integrations/supabase/client'
import { voiceBus } from '@/contexts/VoiceContext'

const uiVoices = ["alloy","echo","fable","onyx","nova","shimmer"] as const;

export class AudioRecorder {
  private stream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private processor: ScriptProcessorNode | null = null
  private source: MediaStreamAudioSourceNode | null = null

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
      })
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      })
      
      this.source = this.audioContext.createMediaStreamSource(this.stream)
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1)
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0)
        this.onAudioData(new Float32Array(inputData))
      }
      
      this.source.connect(this.processor)
      this.processor.connect(this.audioContext.destination)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      throw error
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect()
      this.source = null
    }
    if (this.processor) {
      this.processor.disconnect()
      this.processor = null
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

interface SessionSettings {
  instructions?: string
  temperature?: number
  max_tokens?: number
  voice?: string
  globalVoice?: string
}

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null
  private dc: RTCDataChannel | null = null
  private audioEl: HTMLAudioElement
  private recorder: AudioRecorder | null = null
  private ws: WebSocket | null = null
  private currentVoice: string = "echo"

  constructor(
    private onMessage: (message: any) => void, 
    private onStatusChange: (status: 'connecting' | 'connected' | 'disconnected') => void,
    initialVoice: string = "echo"
  ) {
    this.audioEl = document.createElement("audio")
    this.audioEl.autoplay = true
    this.currentVoice = initialVoice
    
    // Subscribe to voice changes
    voiceBus.on("change", async (newVoice: string) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.disconnect()
        await this.startSession(newVoice)
      }
    })
  }

  async init() {
    await this.startSession(this.currentVoice)
  }

  private async startSession(voice: string) {
    try {
      this.onStatusChange('connecting')
      this.currentVoice = voice
      
      const chosen = uiVoices.includes(voice as any) ? voice : "echo"
      const rtMap = { alloy:"ash", echo:"ash", fable:"ballad",
                      onyx:"sage", nova:"coral", shimmer:"verse" } as const
      const realtimeVoice = rtMap[chosen as keyof typeof rtMap]
      
      // Get ephemeral token from our Supabase Edge Function with voice parameter
      const { data, error } = await supabase.functions.invoke("realtime-chat-token", {
        body: { voice: chosen }
      })
      
      if (error) {
        throw new Error(`Failed to get token: ${error.message}`)
      }
      
      if (!data?.client_secret?.value) {
        throw new Error("Failed to get ephemeral token")
      }

      const EPHEMERAL_KEY = data.client_secret.value

      // Create peer connection
      this.pc = new RTCPeerConnection()

      // Set up remote audio
      this.pc.ontrack = e => this.audioEl.srcObject = e.streams[0]

      // Add local audio track
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.pc.addTrack(ms.getTracks()[0])

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events")
      this.dc.addEventListener("message", (e) => {
        const event = JSON.parse(e.data)
        this.onMessage(event)
      })

      // Create and set local description
      const offer = await this.pc.createOffer()
      await this.pc.setLocalDescription(offer)

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime"
      const model = "gpt-4o-realtime-preview-2024-12-17"
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      })

      if (!sdpResponse.ok) {
        throw new Error(`OpenAI Realtime API error: ${await sdpResponse.text()}`)
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      }
      
      await this.pc.setRemoteDescription(answer)
      this.onStatusChange('connected')

      // Start recording
      this.recorder = new AudioRecorder((audioData) => {
        if (this.dc?.readyState === 'open') {
          this.dc.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: this.encodeAudioData(audioData)
          }))
        }
      })
      await this.recorder.start()

    } catch (error) {
      console.warn("Realtime voice fallback:", error);
      this.onStatusChange('disconnected')
      throw error
    }
  }

  private encodeAudioData(float32Array: Float32Array): string {
    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer)
    let binary = ''
    const chunkSize = 0x8000
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length))
      binary += String.fromCharCode.apply(null, Array.from(chunk))
    }
    
    return btoa(binary)
  }

  async sendMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready')
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
    }

    this.dc.send(JSON.stringify(event))
    this.dc.send(JSON.stringify({type: 'response.create'}))
  }

  interrupt() {
    if (this.dc?.readyState === 'open') {
      this.dc.send(JSON.stringify({
        type: 'response.interrupt'
      }))
    }
  }

  disconnect() {
    // Clean up voice change listener
    voiceBus.off("change")
    
    this.recorder?.stop()
    if (this.dc) {
      this.dc.close()
      this.dc = null
    }
    if (this.pc) {
      this.pc.close()
      this.pc = null
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.onStatusChange('disconnected')
  }
}
