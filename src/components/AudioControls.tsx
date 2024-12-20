import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

interface AudioControlsProps {
  isRecording: boolean
  isMuted: boolean
  onToggleRecording: () => void
  onToggleMute: () => void
}

export default function AudioControls({
  isRecording,
  isMuted,
  onToggleRecording,
  onToggleMute
}: AudioControlsProps) {
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