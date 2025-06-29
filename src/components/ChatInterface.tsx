
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Plus, Mic, MicOff, Volume2, VolumeX, MessageSquare, Settings } from "lucide-react";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import { ConversationList } from "@/components/chat/ConversationList";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { ChatHeader } from "@/components/chat/ChatHeader";
import VoiceChatButton from "@/components/chat/VoiceChatButton";
import VoiceChatOverlay from "@/components/chat/VoiceChatOverlay";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { useChatState } from "@/hooks/use-chat-state";
import { useAudioState } from "@/hooks/use-audio-state";
import { useConversations } from "@/hooks/use-conversations";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const session = useSession();
  const { message, setMessage, handleQuestionClick, startNewChat, currentConversationId } = useChatState();
  const { messages, setMessages, isLoading, loadChatHistory, sendMessage } = useChatMessages(currentConversationId);
  const { isMuted, setIsMuted, speakResponse } = useAudioState();
  const { conversations, isLoading: isLoadingConversations } = useConversations();

  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (session?.user) {
      loadChatHistory();
    }
  }, [session, loadChatHistory]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!message.trim() || isLoading) return;

    try {
      await sendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVoiceChat = () => {
    setIsVoiceChatActive(true);
  };

  const stopVoiceChat = () => {
    setIsVoiceChatActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript("");
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

  const quickQuestions = [
    "What's the best soil pH for cannabis?",
    "How often should I water my plants?",
    "What are the signs of nutrient deficiency?",
    "When should I start flowering?",
    "How to prevent pests naturally?",
    "What's the ideal temperature range?"
  ];

  if (!session) {
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
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-white relative overflow-hidden">
        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <AppSidebar onNewChat={handleNewChat} />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <ChatHeader />

          {/* Messages area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-6">
                      <img
                        src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
                        alt="Master Growbot"
                        className="w-16 h-16"
                      />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      Master Growbot Assistant
                    </h1>
                    <p className="text-gray-300 text-lg">
                      Your AI-powered cannabis cultivation expert. Ask me anything about growing, plant health, nutrients, and more!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className="p-4 bg-card/50 hover:bg-card/70 border border-white/10 rounded-lg text-left transition-all duration-200 hover:border-accent/30"
                        disabled={isLoading}
                      >
                        <p className="text-sm text-gray-300">{question}</p>
                      </button>
                    ))}
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

          {/* Input area */}
          <div className="border-t border-white/10 bg-card/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about growing techniques, plant health, nutrients..."
                    className="min-h-[44px] max-h-32 resize-none bg-background/50 border-white/20 text-white placeholder:text-gray-400 focus:border-accent/50"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-2">
                  <VoiceChatButton
                    onVoiceMessageReceived={handleVoiceMessageReceived}
                    className="min-w-[44px] h-[44px]"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !message.trim()}
                    className="min-w-[44px] h-[44px] bg-gradient-primary hover:bg-gradient-secondary"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Chat Overlay */}
        {isVoiceChatActive && (
          <VoiceChatOverlay
            onClose={stopVoiceChat}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onInterrupt={handleInterrupt}
            onStop={handleStopVoice}
          />
        )}

        {/* Mobile Navigation - Only show on mobile */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 xs:block md:hidden">
          <MobileNavigation />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
