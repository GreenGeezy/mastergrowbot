
import React from 'react';
import { VoiceInterface } from '@/components/mobile/VoiceInterface';

interface VoiceChatOverlayProps {
  isListening: boolean;
  isSpeaking: boolean;
  onInterrupt: () => void;
  onStop: () => void;
  onClose: () => void;
}

const VoiceChatOverlay: React.FC<VoiceChatOverlayProps> = ({
  isListening,
  isSpeaking,
  onInterrupt,
  onStop,
  onClose
}) => {
  const handleToggleListening = () => {
    if (isListening || isSpeaking) {
      onInterrupt();
      onStop();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95">
      <VoiceInterface
        isListening={isListening}
        isSpeaking={isSpeaking}
        onToggleListening={handleToggleListening}
        onClose={onClose}
        className="h-full"
      />
    </div>
  );
};

export default VoiceChatOverlay;
