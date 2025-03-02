
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, Send } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import VoiceChatButton from './chat/VoiceChatButton'

interface ChatInputProps {
  message: string
  isLoading: boolean
  isRecording: boolean
  isMuted: boolean
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onToggleRecording: () => void
  onToggleMute: () => void
  onSpeechResult: (text: string) => void
}

export default function ChatInput({
  message,
  isLoading,
  onMessageChange,
  onSubmit,
  onSpeechResult
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingProgress, setRecordingProgress] = useState(0)
  const [transcription, setTranscription] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null)
  const { toast } = useToast()
  
  // Set up speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        speechRecognitionRef.current = new SpeechRecognition()
        speechRecognitionRef.current.continuous = true
        speechRecognitionRef.current.interimResults = true
        
        speechRecognitionRef.current.onresult = (event) => {
          let interimTranscript = ''
          let finalTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }
          
          // Update the input field in real-time
          if (finalTranscript || interimTranscript) {
            setTranscription(finalTranscript || interimTranscript)
          }
        }
        
        speechRecognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error)
          stopRecording()
        }
      }
    }
    
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop()
      }
    }
  }, [])
  
  // Update input field with transcription
  useEffect(() => {
    if (transcription) {
      // Create a synthetic event to update the message
      const event = {
        target: { value: transcription }
      } as React.ChangeEvent<HTMLInputElement>
      
      onMessageChange(event)
    }
  }, [transcription, onMessageChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e)
  }

  const startRecording = async () => {
    try {
      setTranscription("")
      
      // Start the Web Speech API for real-time transcription
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start()
      }
      
      // Also start MediaRecorder for the backup audio recording
      // This will still be used if we need to send to Whisper for better accuracy
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // If we have a good transcription from the Web Speech API, use that
        if (transcription.length > 5) {
          onSpeechResult(transcription)
          toast({
            title: "Voice transcribed",
            description: "Your voice has been transcribed successfully.",
          })
        } else {
          // Fallback to Whisper API if Web Speech API gave poor results
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          
          // Convert blob to base64
          const reader = new FileReader()
          reader.readAsDataURL(audioBlob)
          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result?.toString().split(',')[1]
              
              if (!base64Audio) {
                throw new Error('Failed to convert audio to base64')
              }
              
              setRecordingProgress(75) // Show uploading progress
              
              // Send to Supabase function
              const { data, error } = await supabase.functions.invoke('transcribe-audio', {
                body: { audio: base64Audio }
              })
              
              if (error) {
                throw new Error(error.message)
              }
              
              if (data?.text) {
                onSpeechResult(data.text)
                toast({
                  title: "Voice transcribed",
                  description: "Your voice has been transcribed successfully.",
                })
              } else {
                throw new Error('No transcription returned')
              }
            } catch (error) {
              console.error('Transcription error:', error)
              toast({
                title: "Transcription failed",
                description: error instanceof Error ? error.message : "Failed to transcribe audio",
                variant: "destructive"
              })
            }
          }
        }
        
        setIsRecording(false)
        setRecordingProgress(0)
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop())
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      
      // Automatically stop after 15 seconds
      const maxRecordingTime = 15000
      const progressInterval = 100
      const progressIncrement = (progressInterval / maxRecordingTime) * 100
      
      let currentProgress = 0
      const progressTimer = setInterval(() => {
        currentProgress += progressIncrement
        setRecordingProgress(Math.min(currentProgress, 70)) // Cap at 70% for processing time
        
        if (currentProgress >= 70) {
          clearInterval(progressTimer)
        }
      }, progressInterval)
      
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          clearInterval(progressTimer)
          mediaRecorderRef.current.stop()
        }
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.stop()
        }
      }, maxRecordingTime)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: "Microphone access failed",
        description: error instanceof Error ? error.message : "Failed to access microphone",
        variant: "destructive"
      })
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop()
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className="p-4 bg-card border-t border-accent/20">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={message}
          onChange={onMessageChange}
          placeholder="Ask about cannabis cultivation..."
          disabled={isLoading || isRecording}
          className="bg-[#1A1E26] border-[#2A2F3B] text-white placeholder:text-gray-400 focus:border-accent focus:ring-accent"
        />
        
        <Button 
          type="button" 
          onClick={handleMicClick}
          disabled={isLoading}
          className={`relative rounded-md shadow-md hover:shadow-lg transition-all duration-200 border border-slate-600/50 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'from-slate-700 to-slate-900 bg-gradient-to-br hover:from-slate-600 hover:to-slate-800'
          }`}
          title={isRecording ? "Stop recording" : "Record voice message"}
        >
          {isRecording && (
            <div 
              className="absolute inset-0 bg-red-500 opacity-30 rounded-md"
              style={{ width: `${recordingProgress}%` }}
            />
          )}
          <Mic className="w-5 h-5" />
        </Button>
        
        <VoiceChatButton 
          onVoiceMessageReceived={onSpeechResult}
        />
        
        <Button 
          type="submit" 
          disabled={isLoading || isRecording}
          className="from-emerald-700 to-emerald-900 bg-gradient-to-br border border-emerald-500/30 hover:from-emerald-600 hover:to-emerald-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isLoading ? (
            <div className="loading-pulse">Sending...</div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>
    </div>
  )
}
