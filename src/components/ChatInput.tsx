
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

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
  onSubmit
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <div className="p-4 bg-card border-t border-accent/20">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={message}
          onChange={onMessageChange}
          placeholder="Ask about cannabis cultivation..."
          disabled={isLoading}
          className="bg-[#1A1E26] border-[#2A2F3B] text-white placeholder:text-gray-400 focus:border-accent focus:ring-accent"
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
  )
}
