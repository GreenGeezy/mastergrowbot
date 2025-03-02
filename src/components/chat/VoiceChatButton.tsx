
import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { RealtimeChat } from '@/utils/RealtimeAudio'

interface VoiceChatButtonProps {
  onVoiceMessageReceived: (message: string) => void
  className?: string
}

const VoiceChatButton: React.FC<VoiceChatButtonProps> = ({ 
  onVoiceMessageReceived,
  className 
}) => {
  const [chatStatus, setChatStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcription, setTranscription] = useState('')
  const chatRef = useRef<RealtimeChat | null>(null)
  const { toast } = useToast()

  const handleMessage = (event: any) => {
    console.log('Received voice event:', event)
    
    // Handle different event types
    if (event.type === 'response.audio.delta') {
      setIsSpeaking(true)
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false)
    } else if (event.type === 'response.assistant_message.delta') {
      if (event.delta && event.delta.length > 0) {
        setTranscription(prev => prev + event.delta)
      }
    } else if (event.type === 'response.assistant_message.done') {
      if (transcription) {
        onVoiceMessageReceived(transcription)
        setTranscription('')
      }
    } else if (event.type === 'session.created') {
      // Update session with our preferred settings
      chatRef.current?.updateSessionSettings()
    }
  }

  const toggleVoiceChat = async () => {
    try {
      if (chatStatus === 'disconnected') {
        chatRef.current = new RealtimeChat(
          handleMessage,
          setChatStatus
        )
        await chatRef.current.init()
        
        toast({
          title: "Voice Chat Connected",
          description: "You can now speak to the AI. Click the microphone again to disconnect.",
        })
      } else {
        chatRef.current?.disconnect()
        chatRef.current = null
        setChatStatus('disconnected')
        setIsSpeaking(false)
        
        toast({
          title: "Voice Chat Disconnected",
          description: "Voice conversation ended.",
        })
      }
    } catch (error) {
      console.error('Error with voice chat:', error)
      setChatStatus('disconnected')
      
      toast({
        title: "Voice Chat Error",
        description: error instanceof Error ? error.message : 'Failed to connect to voice chat',
        variant: "destructive",
      })
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      chatRef.current?.disconnect()
    }
  }, [])

  // Button states
  let buttonIcon
  let buttonClass = className || ''
  
  if (chatStatus === 'connecting') {
    buttonIcon = <Loader2 className="h-5 w-5 animate-spin" />
    buttonClass += ' bg-amber-500 hover:bg-amber-600'
  } else if (chatStatus === 'connected') {
    buttonIcon = <Mic className={`h-5 w-5 ${isSpeaking ? 'animate-pulse text-red-500' : ''}`} />
    buttonClass += ' bg-red-500 hover:bg-red-600'
  } else {
    buttonIcon = <Mic className="h-5 w-5" />
  }

  return (
    <Button
      type="button"
      onClick={toggleVoiceChat}
      className={`cyber-button relative ${buttonClass}`}
      title={chatStatus === 'connected' ? "Stop voice chat" : "Start voice chat"}
      disabled={chatStatus === 'connecting'}
    >
      {buttonIcon}
    </Button>
  )
}

export default VoiceChatButton
