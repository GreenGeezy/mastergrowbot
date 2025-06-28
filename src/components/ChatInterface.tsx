import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Send, Mic, MicOff, Volume2, VolumeX, ArrowLeft, Settings, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { useChatState } from "@/hooks/use-chat-state";
import { useAudioState } from "@/hooks/use-audio-state";
import VoiceChatOverlay from "./chat/VoiceChatOverlay";
import ConversationList from "./chat/ConversationList";
import ProfileDropdown from "./profile/ProfileDropdown";
import { MobileNavigation } from "./mobile/MobileNavigation";

const ChatInterface = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [isVoiceChatOverlayOpen, setIsVoiceChatOverlayOpen] = useState(false);
  const { messages, addMessage, isLoading: messagesLoading } = useChatMessages();
  const { chatState, setChatState, isLoading: chatStateLoading } = useChatState();
  const { audioState, setAudioState, toggleMute } = useAudioState();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const scrollToBottom = useCallback(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  const sendMessage = async (overrideInput?: string) => {
    if (!session) {
      toast.error('Not authenticated');
      return;
    }

    const messageContent = overrideInput !== undefined ? overrideInput : input.trim();

    if (!messageContent) {
      return;
    }

    setInput("");

    const tempMessage = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      createdAt: new Date(),
      isTemporary: true,
    };

    addMessage(tempMessage);
    scrollToBottom();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageContent, userId: session.user.id, conversationId: chatState?.conversationId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.conversationId && (!chatState || data.conversationId !== chatState.conversationId)) {
        setChatState({ conversationId: data.conversationId });
      }

      addMessage({
        id: Date.now().toString(),
        content: data.response,
        role: 'assistant',
        createdAt: new Date(),
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      addMessage({
        id: Date.now().toString(),
        content: 'Sorry, I am having trouble connecting to the server. Please try again later.',
        role: 'assistant',
        createdAt: new Date(),
      });
    } finally {
      // Remove the temporary message
      addMessage({ ...tempMessage, isTemporary: false });
      scrollToBottom();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Your browser does not support recording!');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('userId', session.user.id);
        if (chatState?.conversationId) {
          formData.append('conversationId', chatState.conversationId);
        }

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/voice`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.conversationId && (!chatState || data.conversationId !== chatState.conversationId)) {
            setChatState({ conversationId: data.conversationId });
          }

          addMessage({
            id: Date.now().toString(),
            content: data.response,
            role: 'assistant',
            createdAt: new Date(),
          });
          scrollToBottom();
        } catch (error) {
          console.error('Error sending voice message:', error);
          toast.error('Failed to send voice message');
        } finally {
          setIsRecording(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      setIsRecording(true);
      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone. Please check permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
          }
        })
        .catch(err => {
          console.error("Error accessing microphone:", err);
          toast.error("Could not access microphone. Please check permissions.");
        });
    }
    setIsRecording(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleNewConversation = () => {
    setChatState(null);
  };

  const handleOpenVoiceChatOverlay = () => {
    setIsVoiceChatOverlayOpen(true);
  };

  const handleCloseVoiceChatOverlay = () => {
    setIsVoiceChatOverlayOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 -z-10"
        style={{
          backgroundImage: "url('/assets/336-banner.png')",
          backgroundPosition: 'center top'
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-background to-background -z-10" />

      {/* Header */}
      <header className="w-full flex items-center justify-between p-4 sm:p-6 border-b border-accent/20 z-30 bg-card/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <button onClick={() => setShowConversations(!showConversations)} className="hover:opacity-75 transition-opacity">
            <MessageSquare className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-medium hidden sm:block">Growing Assistant</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleOpenVoiceChatOverlay}>
            <Plus className="w-4 h-4 mr-2" />
            New Voice Chat
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSettingsClick} className="hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </Button>
          <ProfileDropdown />
        </div>
      </header>

      {/* Mobile Navigation - Only show on mobile */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 xs:block md:hidden">
        <MobileNavigation />
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
        <ChatMessages messages={messages} isLoading={messagesLoading} />
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-0 bg-card/80 backdrop-blur-md p-4 sm:p-6 border-t border-accent/20 z-30">
        <div className="flex items-center space-x-3">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow rounded-full bg-card border-accent/20 text-white placeholder:text-gray-400"
          />
          <Button
            variant="secondary"
            onClick={sendMessage}
            className="rounded-full"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={isRecording ? stopRecording : startRecording}
            className="rounded-full"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant="secondary"
            onClick={toggleMute}
            className="rounded-full"
          >
            {audioState.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p>Coming soon!</p>
            <Button onClick={handleCloseSettings}>Close</Button>
          </div>
        </div>
      )}

      {/* Conversation List */}
      {showConversations && (
        <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-accent/20 z-40">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Conversations</h3>
            <Button variant="secondary" onClick={handleNewConversation} className="w-full mb-4">
              New Conversation
            </Button>
            <ConversationList onClose={() => setShowConversations(false)} />
          </div>
        </div>
      )}

      {/* Voice Chat Overlay */}
      <VoiceChatOverlay isOpen={isVoiceChatOverlayOpen} onClose={handleCloseVoiceChatOverlay} />
    </div>
  );
};

export default ChatInterface;
