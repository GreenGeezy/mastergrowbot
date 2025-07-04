
import React, { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { RealtimeChat } from '@/utils/RealtimeAudio'
import { supabase } from '@/integrations/supabase/client'
import { useSession } from '@supabase/auth-helpers-react'
import VoiceIcon from '@/components/icons/VoiceIcon'

interface VoiceChatButtonProps {
  onVoiceMessageReceived: (message: string) => void
  onStateChange?: (isListening: boolean, isSpeaking: boolean) => void
  className?: string
}

interface AssistantSettings {
  system_instructions?: string
  temperature?: number
  max_tokens?: number
  voice_settings?: {
    voice?: string
  }
}

const VoiceChatButton: React.FC<VoiceChatButtonProps> = ({ 
  onVoiceMessageReceived,
  onStateChange,
  className 
}) => {
  const [chatStatus, setChatStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [settings, setSettings] = useState<AssistantSettings>({
    system_instructions: "You are Master Growbot, an AI cannabis cultivation assistant. Help users with growing advice, plant health, and answer questions clearly and accurately.",
    temperature: 0.7,
    max_tokens: 1000,
    voice_settings: { voice: "alloy" }
  })
  const chatRef = useRef<RealtimeChat | null>(null)
  const { toast } = useToast()
  const session = useSession()

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(isListening, isSpeaking)
  }, [isListening, isSpeaking, onStateChange])

  const fetchAssistantSettings = async () => {
    if (!session?.user?.id) return
    
    try {
      const { data, error } = await supabase
        .from('assistant_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
      
      if (error) {
        console.error('Error fetching assistant settings:', error)
        return
      }
      
      if (data) {
        setSettings({
          system_instructions: data.system_instructions,
          temperature: data.temperature,
          max_tokens: data.max_tokens,
          voice_settings: data.voice_settings
        })
      }
    } catch (error) {
      console.error('Failed to fetch assistant settings:', error)
    }
  }

  useEffect(() => {
    fetchAssistantSettings()
  }, [session?.user?.id])

  const handleMessage = (event: any) => {
    console.log('Received voice event:', event)
    
    // Handle different event types
    if (event.type === 'response.audio.delta') {
      setIsSpeaking(true)
      setIsListening(false)
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false)
    } else if (event.type === 'input_audio_transcription.delta') {
      setIsListening(true)
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
      chatRef.current?.updateSessionSettings({
        instructions: settings.system_instructions,
        temperature: settings.temperature,
        voice: settings.voice_settings?.voice || "alloy"
      })
    }
  }

  const toggleVoiceChat = async () => {
    try {
      if (chatStatus === 'disconnected') {
        // Start voice chat - this will trigger the voice interface
        setIsListening(true)
        setChatStatus('connecting')
        
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
        disconnectVoiceChat()
      }
    } catch (error) {
      console.error('Error with voice chat:', error)
      setChatStatus('disconnected')
      setIsListening(false)
      setIsSpeaking(false)
      
      toast({
        title: "Voice Chat Error",
        description: error instanceof Error ? error.message : 'Failed to connect to voice chat',
        variant: "destructive",
      })
    }
  }

  const disconnectVoiceChat = () => {
    chatRef.current?.disconnect()
    chatRef.current = null
    setChatStatus('disconnected')
    setIsSpeaking(false)
    setIsListening(false)
    
    toast({
      title: "Voice Chat Disconnected",
      description: "Voice conversation ended.",
    })
  }

  const handleInterrupt = () => {
    // Send interrupt signal to stop AI from speaking
    chatRef.current?.interrupt()
    setIsSpeaking(false)
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
  } else if (chatStatus === 'connected' || isListening || isSpeaking) {
    buttonIcon = <VoiceIcon className={`h-5 w-5 ${isSpeaking ? 'animate-pulse text-red-500' : isListening ? 'text-blue-500' : ''}`} />
    buttonClass += ' bg-blue-600 hover:bg-blue-700 from-blue-700 to-purple-900 bg-gradient-to-br border border-blue-500/30'
  } else {
    buttonIcon = <VoiceIcon className="h-5 w-5" />
    buttonClass += ' from-blue-700 to-purple-900 bg-gradient-to-br border border-blue-500/30 hover:from-blue-600 hover:to-purple-800 shadow-md hover:shadow-lg transition-all duration-200'
  }

  return (
    <Button
      type="button"
      onClick={toggleVoiceChat}
      className={`cyber-button relative ${buttonClass}`}
      title={chatStatus === 'connected' || isListening || isSpeaking ? "Stop voice chat" : "Start voice chat"}
      disabled={chatStatus === 'connecting'}
    >
      {buttonIcon}
    </Button>
  )
}

export default VoiceChatButton
