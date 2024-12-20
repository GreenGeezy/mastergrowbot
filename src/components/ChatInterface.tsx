import { useState, useEffect, useRef } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { Leaf, Send, MessageCircle, Camera, BookOpen, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import FeatureCard from './FeatureCard'

// Audio recorder class for handling microphone input
class AudioRecorder {
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
      this.audioContext = new AudioContext({ sampleRate: 24000 });
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

// Audio queue for managing sequential playback
class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData.buffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext();
    }
  }
}

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
}

const starterQuestions = [
  "What nutrients are essential during the vegetative stage?",
  "How do I identify and fix nutrient deficiencies?",
  "What's the ideal temperature and humidity for flowering?",
  "How can I prevent and treat common pests?",
  "When is the best time to harvest?"
];

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const session = useSession()
  const { toast } = useToast()
  const audioRecorderRef = useRef<AudioRecorder | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const audioQueueRef = useRef<AudioQueue | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      loadChatHistory()
      initializeWebSocket()
    }
    return () => {
      wsRef.current?.close()
    }
  }, [session?.user?.id])

  const initializeWebSocket = () => {
    const ws = new WebSocket(`wss://inbfxduleyhygxatxmre.functions.supabase.co/functions/v1/realtime-chat`)
    wsRef.current = ws

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      console.log('WebSocket message received:', data)

      if (data.type === 'session.created') {
        // Send session configuration after connection is established
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: "You are Master Growbot, an AI cannabis cultivation expert. Your knowledge cutoff is 2023-10.",
            voice: "alloy",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            }
          }
        }))
      }

      if (data.type === 'response.audio.delta' && !isMuted) {
        const binaryString = atob(data.delta)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
        }
        
        if (!audioQueueRef.current) {
          audioQueueRef.current = new AudioQueue(audioContextRef.current)
        }
        
        await audioQueueRef.current.addToQueue(bytes)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to voice service',
        variant: 'destructive',
      })
    }
  }

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      if (data) setMessages(data)
    } catch (error) {
      console.error('Error loading chat history:', error)
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      })
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      audioRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      try {
        audioRecorderRef.current = new AudioRecorder((audioData) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const base64Audio = encodeAudioData(audioData)
            wsRef.current.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: base64Audio
            }))
          }
        })
        await audioRecorderRef.current.start()
        setIsRecording(true)
      } catch (error) {
        console.error('Error starting recording:', error)
        toast({
          title: 'Error',
          description: 'Failed to access microphone',
          variant: 'destructive',
        })
      }
    }
  }

  const encodeAudioData = (float32Array: Float32Array): string => {
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch('/functions/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          message,
          userId: session?.user?.id,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setMessage('')
      await loadChatHistory()
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionClick = (question: string) => {
    setMessage(question)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 h-screen w-full bg-[#222222] border border-[#333333] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#333333] bg-[#1A1A1A]">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
                alt="Master Growbot Logo" 
                className="w-10 h-10 rounded-full"
              />
              <h1 className="text-xl font-semibold text-white">Master Growbot</h1>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                size="icon"
                className={`rounded-full ${isMuted ? 'bg-red-500/10 text-red-500' : 'hover:bg-accent/10'}`}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Button
                onClick={toggleRecording}
                variant="ghost"
                size="icon"
                className={`rounded-full ${isRecording ? 'bg-red-500/10 text-red-500' : 'hover:bg-accent/10'}`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center glow-effect">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">How can I help you today?</h2>
                <p className="text-gray-400 max-w-md">
                  I'm your cannabis cultivation assistant. Ask me anything about growing, plant care, or troubleshooting issues.
                </p>
                
                <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
                  <FeatureCard
                    icon={MessageCircle}
                    title="Growing Assistant"
                    subtitle="Get expert growing advice"
                    onClick={() => handleQuestionClick("Can you help me optimize my growing setup?")}
                  />
                  <FeatureCard
                    icon={Camera}
                    title="Plant Health Check"
                    subtitle="Diagnose plant issues"
                    onClick={() => handleQuestionClick("How can I identify common plant health issues?")}
                  />
                  <FeatureCard
                    icon={BookOpen}
                    title="Growing Guide"
                    subtitle="Quick answers to FAQs"
                    onClick={() => handleQuestionClick("What are the essential steps for successful cannabis cultivation?")}
                  />
                </div>

                <div className="w-full max-w-2xl mt-2">
                  <h3 className="text-white text-left mb-2 font-medium">Common Questions</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {starterQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className="cyber-button text-left p-3 rounded-lg text-gray-300 hover:text-white text-sm transition-all duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_ai ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.is_ai
                          ? 'message-bubble-ai'
                          : 'message-bubble-user'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 bg-[#1A1A1A] border-t border-[#333333]">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about cannabis cultivation..."
                disabled={isLoading}
                className="bg-[#333333] border-[#444444] text-white placeholder:text-gray-400 focus:border-accent focus:ring-accent"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="cyber-button"
              >
                {isLoading ? (
                  <div className="loading-pulse">Sending...</div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}