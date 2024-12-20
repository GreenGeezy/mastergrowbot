import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface ChatInputProps {
  message: string
  isLoading: boolean
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function ChatInput({
  message,
  isLoading,
  onMessageChange,
  onSubmit
}: ChatInputProps) {
  return (
    <div className="p-4 bg-[#1A1A1A] border-t border-[#333333]">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          value={message}
          onChange={onMessageChange}
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
  )
}