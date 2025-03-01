
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';

interface VoiceInterfaceProps {
  onTranscript: (text: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onTranscript }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);
  const [transcripts, setTranscripts] = useState<string>('');

  const handleMessage = (event: any) => {
    console.log('Received event:', event);
    
    // Handle different event types
    if (event.type === 'response.audio.delta') {
      setIsSpeaking(true);
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false);
    }
  };

  // Collect transcripts
  const handleTranscript = (text: string) => {
    setTranscripts(prev => prev + text);
  };

  // When transcript is complete, send it to parent
  useEffect(() => {
    let timeout: number;
    
    if (transcripts && !isListening) {
      timeout = window.setTimeout(() => {
        onTranscript(transcripts);
        setTranscripts('');
      }, 1000);
    }
    
    return () => {
      clearTimeout(timeout);
    };
  }, [transcripts, isListening, onTranscript]);

  const startConversation = async () => {
    try {
      chatRef.current = new RealtimeChat(handleMessage, handleTranscript);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: "Voice interface is ready",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const toggleListening = () => {
    if (!chatRef.current || !isConnected) return;
    
    if (isListening) {
      chatRef.current.stopListening();
      setIsListening(false);
    } else {
      chatRef.current.startListening();
      setIsListening(true);
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="p-2">
        <Button 
          onClick={startConversation}
          className="bg-gradient-primary hover:bg-gradient-secondary text-white w-full"
        >
          Start Voice Conversation
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Button 
          onClick={toggleListening}
          className={`flex-1 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-primary hover:bg-gradient-secondary'} text-white`}
          disabled={isSpeaking}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Listening
            </>
          )}
        </Button>
        
        <Button 
          onClick={endConversation}
          variant="outline"
          className="text-white border-accent/30 hover:bg-accent/10"
        >
          End Voice Chat
        </Button>
      </div>
      
      {isListening && (
        <div className="mt-2 text-xs text-gray-400 text-center animate-pulse">
          Listening... (speak now)
        </div>
      )}
      
      {isSpeaking && (
        <div className="mt-2 text-xs text-green-400 text-center animate-pulse">
          Assistant is speaking...
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;
