import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VoiceContextType {
  voice: string;
  setVoice: (voice: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

interface VoiceProviderProps {
  children: ReactNode;
}

const VALID_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
const STORAGE_KEY = 'mastergrowbot-voice-preference';

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [voice, setVoiceState] = useState<string>('echo');

  // Load voice preference from localStorage on mount
  useEffect(() => {
    try {
      const savedVoice = localStorage.getItem(STORAGE_KEY);
      if (savedVoice && VALID_VOICES.includes(savedVoice as any)) {
        setVoiceState(savedVoice);
      }
    } catch (error) {
      console.warn('Failed to load voice preference from localStorage:', error);
    }
  }, []);

  // Save voice preference to localStorage when it changes
  const setVoice = (newVoice: string) => {
    if (VALID_VOICES.includes(newVoice as any)) {
      setVoiceState(newVoice);
      try {
        localStorage.setItem(STORAGE_KEY, newVoice);
      } catch (error) {
        console.warn('Failed to save voice preference to localStorage:', error);
      }
    }
  };

  const value: VoiceContextType = {
    voice,
    setVoice,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};