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
import AttachmentButton from "@/components/chat/AttachmentButton";
import VoiceChatOverlay from "@/components/chat/VoiceChatOverlay";
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
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

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
      
      // If there are attached files, we could process them here
      // For now, we'll just mention them in the message
      let messageWithAttachments = message;
      if (attachedFiles.length > 0) {
        const fileNames = attachedFiles.map(f => f.name).join(', ');
        messageWithAttachments += `\n\n[Attached files: ${fileNames}]`;
      }
      
      await sendMessage(messageWithAttachments);
      setMessage("");
      setAttachedFiles([]);
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

  const handleFileSelect = (files: File[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

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
    <div className="flex h-screen w-full bg-background text-white relative overflow-hidden">
      {/* Chat History Sidebar */}
      <ChatHistorySidebar onConversationSelect={handleConversationSelect} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 ml-12">
        {/* Messages area - adjusted for bottom navigation on all devices */}
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
                    <p className="text-gray-300 text-lg text-left">
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
                        className="p-2 bg-card/30 hover:bg-card/50 border border-white/10 rounded-lg text-left transition-all duration-200 hover:border-accent/30 text-xs"
                        disabled={isLoading}
                      >
                        <p className="text-gray-300">{question}</p>
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
        <div className="border-t border-white/10 bg-card/50 backdrop-blur-sm pb-20">
          <div className="max-w-4xl mx-auto p-4">
            {/* Show attached files */}
            {attachedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center bg-background/70 rounded-lg px-3 py-1 text-sm">
                    <span className="mr-2">{file.name}</span>
                    <button
                      onClick={() => removeAttachedFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Chat input with voice and send buttons */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <ChatInput
                  variant="default"
                  value={message}
                  onChange={handleMessageChange}
                  onSubmit={handleSendMessage}
                  loading={isLoading}
                  className="bg-background/50 border-white/20 text-white w-full"
                >
                  <div className="flex flex-col gap-2 w-full">
                    <ChatInputTextArea 
                      placeholder="Ask about growing techniques, plant health, nutrients..."
                      className="text-white placeholder:text-gray-400 focus:border-accent/50 flex-1 min-h-[60px]"
                      disabled={isLoading}
                      rows={2}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AttachmentButton
                          onFileSelect={handleFileSelect}
                          disabled={isLoading}
                          className="min-w-[44px] h-[44px]"
                        />
                        <VoiceChatButton
                          onVoiceMessageReceived={handleVoiceMessageReceived}
                          className="min-w-[44px] h-[44px]"
                        />
                      </div>
                      <ChatInputSubmit className="bg-gradient-primary hover:bg-gradient-secondary" />
                    </div>
                  </div>
                </ChatInput>
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

      {/* Bottom Navigation - show on all devices */}
      <BottomNavigation />
    </div>
  );
};

export default ChatInterface;
