
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Plus, Mic, MicOff, Volume2, VolumeX, MessageSquare, Settings, MessageCircle, Camera, BookOpen } from "lucide-react";
import ChatMessages from "@/components/ChatMessages";
import { ConversationList } from "@/components/chat/ConversationList";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import VoiceChatButton from "@/components/chat/VoiceChatButton";
import { VoiceInterface } from "@/components/mobile/VoiceInterface";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { ChatHistorySidebar } from "@/components/chat/ChatHistorySidebar";
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/ui/chat-input";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { useChatState } from "@/hooks/use-chat-state";
import { useAudioState } from "@/hooks/use-audio-state";
import { useConversations } from "@/hooks/use-conversations";
import { isIOSPreview } from "@/utils/flags";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Particles } from '@/components/ui/particles';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { message, setMessage, handleQuestionClick, startNewChat, currentConversationId, ensureConversationId } = useChatState();
  const { messages, setMessages, isLoading, loadChatHistory, sendMessage } = useChatMessages(currentConversationId);
  const { isMuted, setIsMuted, speakResponse } = useAudioState();
  const { conversations, isLoading: isLoadingConversations } = useConversations();

  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [forceCloseVoiceChat, setForceCloseVoiceChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (session?.user || isIOSPreview) {
      loadChatHistory();
    }
  }, [session, loadChatHistory, isIOSPreview]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    try {
      // Ensure we have a conversation ID before sending
      const conversationId = ensureConversationId();
      console.log('Sending message with conversation ID:', conversationId);
      
      await sendMessage(message, []);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const startVoiceChat = () => {
    setIsVoiceChatActive(true);
    setForceCloseVoiceChat(false);
  };

  const stopVoiceChat = () => {
    console.log('Stopping voice chat and closing interface');
    setIsVoiceChatActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript("");
    setForceCloseVoiceChat(true);
  };

  const handleInterrupt = () => {
    setIsSpeaking(false);
  };

  const handleStopVoice = () => {
    setIsListening(false);
    setIsSpeaking(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleNewChat = () => {
    startNewChat();
    setMessage("");
  };

  const handleConversationSelect = (conversationId: string) => {
    // Load conversation messages
    console.log("Loading conversation:", conversationId);
  };

  const handleVoiceMessageReceived = (voiceMessage: string) => {
    setMessage(voiceMessage);
  };

  // Handle voice chat state updates from VoiceChatButton
  const handleVoiceChatStateChange = (listening: boolean, speaking: boolean) => {
    console.log('Voice chat state change:', { listening, speaking });
    setIsListening(listening);
    setIsSpeaking(speaking);
    // Show voice interface when either listening or speaking, but not if force close is active
    if ((listening || speaking) && !forceCloseVoiceChat) {
      setIsVoiceChatActive(true);
    }
  };

  // Handle voice interface close
  const handleVoiceInterfaceClose = () => {
    console.log('Voice interface close requested - forcing close');
    stopVoiceChat();
  };

  // Reset force close when voice chat becomes inactive
  useEffect(() => {
    if (!isVoiceChatActive) {
      setForceCloseVoiceChat(false);
    }
  }, [isVoiceChatActive]);

  const quickQuestions = [
    "What's the best soil pH for cannabis?",
    "How often should I water my plants?",
    "What are the signs of nutrient deficiency?",
    "When should I start flowering?",
    "How to prevent pests naturally?",
    "What's the ideal temperature range?"
  ];

  // Skip authentication check in iOS preview mode
  if (!isIOSPreview && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
          <p className="text-gray-600">Please sign in to access the growing assistant.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 relative overflow-hidden">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={40}
        ease={80}
        color="#22c55e"
        size={8}
        refresh
      />
      
      {/* Chat History Sidebar */}
      <ChatHistorySidebar onConversationSelect={handleConversationSelect} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 ml-12">
        {/* Messages area - adjusted for voice interface and bottom navigation */}
        <div className="flex-1 overflow-hidden flex flex-col pb-32">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col">
              {/* Logo and description section */}
              <div className="flex items-center justify-center p-4 pt-8">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <img
                      src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
                      alt="Master Growbot"
                      className="w-16 h-16 flex-shrink-0"
                    />
                    <p className="text-gray-600 text-lg text-left">
                      Your AI-powered cannabis cultivation expert. Ask me anything about growing, plant health, nutrients, and more!
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Suggested questions section - moved to separate area */}
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto w-full">
                  <div className="grid grid-cols-2 gap-2 max-w-4xl mx-auto">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-all duration-200 hover:border-green-400 text-xs"
                        disabled={isLoading}
                      >
                        <p className="text-gray-600">{question}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4">
              <div className="max-w-4xl mx-auto py-4">
                <ChatMessages 
                  messages={messages}
                  handleQuestionClick={handleQuestionClick}
                  starterQuestions={quickQuestions}
                />
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input area - moved lower and adjusted for bottom navigation */}
        <div className="border-t border-gray-200 bg-gray-50 backdrop-blur-sm pb-20">
          <div className="max-w-4xl mx-auto p-4">
            {/* Chat input with voice and send buttons */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <ChatInput
                  variant="default"
                  value={message}
                  onChange={handleMessageChange}
                  onSubmit={handleSendMessage}
                  loading={isLoading}
                  className="bg-white border-gray-300 text-gray-900 w-full"
                >
                  <div className="flex flex-col gap-2 w-full">
                    <ChatInputTextArea 
                      placeholder="Ask about growing techniques, plant health, nutrients..."
                      className="text-gray-900 placeholder:text-gray-600 focus:border-green-400 flex-1 min-h-[60px]"
                      disabled={isLoading}
                      rows={2}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <VoiceChatButton
                          onVoiceMessageReceived={handleVoiceMessageReceived}
                          onStateChange={handleVoiceChatStateChange}
                          className="min-w-[44px] h-[44px]"
                          forceClose={forceCloseVoiceChat}
                        />
                      </div>
                      <ChatInputSubmit 
                        variant="cta" 
                        size="icon"
                        className="min-w-[44px] h-[44px] rounded-2xl"
                      />
                    </div>
                  </div>
                </ChatInput>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Interface Overlay - Show when voice chat is active */}
      {isVoiceChatActive && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <VoiceInterface
            isListening={isListening}
            isSpeaking={isSpeaking}
            onToggleListening={() => {
              console.log('Toggle listening from voice interface');
              // Toggle the voice chat state
              if (isListening || isSpeaking) {
                setIsListening(false);
                setIsSpeaking(false);
              }
            }}
            onClose={handleVoiceInterfaceClose}
            className="h-full w-full"
          />
        </div>
      )}

      {/* Bottom Navigation - show on all devices */}
      <BottomNavigation />
    </div>
  );
};

export default ChatInterface;
