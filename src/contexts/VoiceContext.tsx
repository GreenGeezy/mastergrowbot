import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import mitt from "mitt";

export const voiceBus = mitt<{ change: string }>();

type VoiceCtx = { voice: string; setVoice: (v: string) => void };
const VoiceContext = createContext<VoiceCtx | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [voiceState, setVoiceState] = useState<string>(() => localStorage.getItem("mg-voice") || "echo");
  
  useEffect(() => localStorage.setItem("mg-voice", voiceState), [voiceState]);
  
  const setVoice = (v: string) => {
    setVoiceState(v);
    voiceBus.emit("change", v);
  };
  
  return <VoiceContext.Provider value={{ voice: voiceState, setVoice }}>{children}</VoiceContext.Provider>;
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  // Fallback so page never crashes even if provider missing
  return ctx ?? { voice: "echo", setVoice: () => {} };
}