import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'

interface AudioControlsProps {
  isRecording: boolean
  isMuted: boolean
  onToggleRecording: () => void
  onToggleMute: () => void
  onSpeechResult: (text: string) => void
}

export default function AudioControls({
  isRecording,
  isMuted,
  onToggleRecording,
  onToggleMute,
  onSpeechResult
}: AudioControlsProps) {
  const { toast } = useToast()
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          onSpeechResult(transcript)
          onToggleRecording() // Stop recording after getting result
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          })
          onToggleRecording()
        }

        setRecognition(recognition)
      }
    }
  }, [onSpeechResult, onToggleRecording, toast])

  useEffect(() => {
    if (recognition) {
      if (isRecording) {
        try {
          recognition.start()
        } catch (error) {
          console.error('Error starting speech recognition:', error)
          toast({
            title: "Error",
            description: "Failed to start speech recognition. Please try again.",
            variant: "destructive",
          })
          onToggleRecording()
        }
      } else {
        try {
          recognition.stop()
        } catch (error) {
          console.error('Error stopping speech recognition:', error)
        }
      }
    }
  }, [isRecording, recognition, toast, onToggleRecording])

  return (
    <div className="flex space-x-2">
      <Button
        onClick={onToggleMute}
        variant="ghost"
        size="icon"
        className={`rounded-full ${isMuted ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'hover:bg-accent/10'}`}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
      <Button
        onClick={onToggleRecording}
        variant="ghost"
        size="icon"
        className={`rounded-full ${isRecording ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'hover:bg-accent/10'}`}
      >
        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>
    </div>
  )
}