
import { Menu, X, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

interface ChatHeaderProps {
  onToggleVoice?: () => void;
  showVoiceInterface?: boolean;
}

export function ChatHeader({ onToggleVoice, showVoiceInterface }: ChatHeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <div className="border-b border-accent/20 p-3 flex items-center justify-between bg-[#1A1E26]">
      <div className="flex items-center gap-2">
        <Button 
          size="icon" 
          variant="ghost" 
          className="md:hidden text-white"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-white tracking-tight truncate">Master Growbot</h2>
      </div>
      <div className="flex items-center space-x-2">
        {onToggleVoice && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:text-green-400 hover:bg-accent/10"
            onClick={onToggleVoice}
            title={showVoiceInterface ? "Switch to text chat" : "Switch to voice chat"}
          >
            {showVoiceInterface ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
        )}
      </div>
    </div>
  )
}
