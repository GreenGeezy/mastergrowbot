
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import { VoiceProvider } from '@/contexts/VoiceContext';

const ChatInterfacePage = () => {
  return (
    <VoiceProvider>
      <ChatInterface />
    </VoiceProvider>
  );
};

export default ChatInterfacePage;
