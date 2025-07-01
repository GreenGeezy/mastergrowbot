
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ConversationList } from './chat/ConversationList';
import BottomNavigation from './navigation/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { SparklesCore } from '@/components/ui/sparkles';

const ChatInterface = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!session) {
    return null;
  }

  // Mock data for ConversationList - you'll need to replace this with real data
  const mockConversations = [
    {
      id: '1',
      title: 'Growing Tips',
      lastMessage: 'How often should I water my plants?',
      updatedAt: new Date().toISOString()
    }
  ];

  const handleQuestionClick = (question: string) => {
    // Handle starter question click
    console.log('Question clicked:', question);
  };

  const starterQuestions = [
    "How often should I water my cannabis plants?",
    "What's the ideal temperature for growing?",
    "When should I harvest my plants?",
    "How do I identify nutrient deficiencies?"
  ];

  // Mock messages - replace with real chat messages
  const messages = [];

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Sparkles Background */}
      <div className="fixed inset-0 w-full h-full">
        <SparklesCore
          id="chat-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={30}
          className="w-full h-full"
          particleColor="#36d399"
          speed={0.8}
        />
      </div>

      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobile ? 'w-80' : 'w-80'} transition-transform duration-300 ease-in-out bg-card/95 backdrop-blur-sm border-r border-white/10`}>
        <ConversationList 
          conversations={mockConversations}
          isLoading={false}
          currentConversationId={null}
          onConversationSelect={(id) => console.log('Selected conversation:', id)}
        />
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10 pb-20">
        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <ChatMessages 
            messages={messages}
            handleQuestionClick={handleQuestionClick}
            starterQuestions={starterQuestions}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-white/10 bg-card/90 backdrop-blur-sm">
          <ChatInput 
            message=""
            isLoading={false}
            onMessageChange={() => {}}
            onSubmit={() => {}}
            onSpeechResult={() => {}}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ChatInterface;
