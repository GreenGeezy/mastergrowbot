
"use client";

import * as React from "react";
import { Paperclip, Sparkles, MessageSquare, Send } from "lucide-react";
import VoiceChatButton from "@/components/chat/VoiceChatButton";
import { Textarea } from "@/components/ui/textarea";

interface Hero1Props {
  onQuestionClick?: (question: string) => void;
  onFeedbackClick?: () => void;
  questions?: string[];
  message?: string;
  onMessageChange?: (message: string) => void;
  onSendMessage?: () => void;
  isLoading?: boolean;
  onVoiceMessageReceived?: (message: string) => void;
}

const Hero1 = ({ 
  onQuestionClick, 
  onFeedbackClick, 
  questions = [],
  message = "",
  onMessageChange,
  onSendMessage,
  isLoading = false,
  onVoiceMessageReceived
}: Hero1Props) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage?.();
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex flex-col relative overflow-x-hidden">
      {/* Gradient */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-50">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-50rem] right-[-50rem] z-[0] blur-[4rem] skew-[-40deg] opacity-50">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-60rem] right-[-60rem] z-[0] blur-[4rem] skew-[-40deg] opacity-50">
        <div className="w-[10rem] h-[30rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem] bg-gradient-to-r from-white to-blue-300"></div>
      </div>
      
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png" 
            width={30} 
            height={30} 
            alt="Master Growbot"
            className="w-8 h-8"
          />
          <div className="font-bold text-md">Master Growbot</div>
        </div>
        <button 
          onClick={onFeedbackClick}
          className="bg-white text-black hover:bg-gray-200 rounded-full px-4 py-2 text-sm cursor-pointer font-semibold min-h-[44px]"
        >
          Share Feedback
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex-1 flex justify-center">
            <div className="bg-[#1c1528] rounded-full px-4 py-2 flex items-center gap-2 w-fit mx-4">
              <span className="text-xs flex items-center gap-2">
                <span className="bg-black p-1 rounded-full">
                  <MessageSquare className="w-3 h-3" />
                </span>
                AI-Powered Cannabis Cultivation Expert
              </span>
            </div>
          </div>
          
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-primary via-accent to-accent2 bg-clip-text text-transparent">
            Master Growbot Assistant
          </h1>

          {/* Subtitle */}
          <p className="text-md text-gray-300">
            Your AI-powered cannabis cultivation expert. Ask me anything about growing, plant health, nutrients, and more!
          </p>

          {/* Enhanced Search/Chat Input - 4x larger */}
          <div className="relative max-w-4xl mx-auto w-full">
            <div className="bg-[#1c1528] rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <button className="p-3 rounded-full hover:bg-[#2a1f3d] transition-all min-h-[44px] min-w-[44px]">
                  <Paperclip className="w-6 h-6 text-gray-400" />
                </button>
                <button className="p-3 rounded-full hover:bg-[#2a1f3d] transition-all min-h-[44px] min-w-[44px]">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </button>
                <div className="flex-1">
                  <Textarea
                    value={message}
                    onChange={(e) => onMessageChange?.(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about growing techniques, plant health, nutrients..."
                    className="min-h-[120px] max-h-64 resize-none bg-transparent border-none text-white placeholder:text-gray-400 text-lg leading-relaxed focus:ring-0 focus:border-none p-4"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              {/* Action buttons row */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                <div className="flex gap-3">
                  {onVoiceMessageReceived && (
                    <VoiceChatButton
                      onVoiceMessageReceived={onVoiceMessageReceived}
                      className="min-w-[44px] h-[44px] bg-gray-700 hover:bg-gray-600"
                    />
                  )}
                </div>
                <button
                  onClick={onSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="min-w-[44px] h-[44px] bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-12 max-w-2xl mx-auto">
            {questions.map((question, index) => (
              <button
                key={index}
                onClick={() => onQuestionClick?.(question)}
                className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm transition-all duration-200 min-h-[44px]"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export { Hero1 };
