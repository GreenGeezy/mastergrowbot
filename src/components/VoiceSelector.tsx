import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VoiceSelectorProps {
  voice: string;
  onChange: (voice: string) => void;
}

const VALID_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ voice, onChange }) => {
  // Fallback to "echo" if invalid voice prop
  const currentVoice = VALID_VOICES.includes(voice as any) ? voice : 'echo';

  const handleValueChange = (value: string) => {
    // Only call onChange if the selection is one of the six valid voices
    if (VALID_VOICES.includes(value as any)) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="voice-selector" className="text-sm font-medium text-foreground">
        Voice:
      </label>
      <Select value={currentVoice} onValueChange={handleValueChange}>
        <SelectTrigger id="voice-selector" className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {VALID_VOICES.map((voiceOption) => (
            <SelectItem key={voiceOption} value={voiceOption}>
              {voiceOption.charAt(0).toUpperCase() + voiceOption.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};