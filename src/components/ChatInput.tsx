
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, Send } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const { toast } = useToast()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e)
  }

  const startRecording = async () => {
    try {
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
          } finally {
            setIsRecording(false)
            setRecordingProgress(0)
            
            // Stop all tracks in the stream
            stream.getTracks().forEach(track => track.stop())
          }
        }
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      
      // Automatically stop after 10 seconds instead of 15 seconds
      const maxRecordingTime = 10000
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
          className={`cyber-button relative ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
          title={isRecording ? "Stop recording" : "Record voice message"}
        >
          {isRecording && (
            <div 
              className="absolute inset-0 bg-primary opacity-30 rounded-md"
              style={{ width: `${recordingProgress}%` }}
            />
          )}
          <Mic className="w-5 h-5" />
        </Button>
        
        <Button 
          type="submit" 
          disabled={isLoading || isRecording}
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
  )
}
