import { Button } from '@/components/ui/button'

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
  return null;
}
