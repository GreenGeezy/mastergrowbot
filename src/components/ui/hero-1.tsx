
"use client";

import * as React from "react";
import { Paperclip, Sparkles, MessageSquare } from "lucide-react";

interface Hero1Props {
  onQuestionClick?: (question: string) => void;
  onFeedbackClick?: () => void;
  questions?: string[];
}

const Hero1 = ({ onQuestionClick, onFeedbackClick, questions = [] }: Hero1Props) => {
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

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="bg-[#1c1528] rounded-full p-3 flex items-center">
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </button>
              <input
                type="text"
                placeholder="Ask about growing techniques, plant health, nutrients..."
                className="bg-transparent flex-1 outline-none text-gray-300 pl-4 min-h-[44px]"
              />
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
