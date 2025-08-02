import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type VoiceCtx = { voice: string; setVoice: (v: string) => void };
const VoiceContext = createContext<VoiceCtx | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [voice, setVoice] = useState<string>(() => localStorage.getItem("mg-voice") || "echo");
  useEffect(() => localStorage.setItem("mg-voice", voice), [voice]);
  return <VoiceContext.Provider value={{ voice, setVoice }}>{children}</VoiceContext.Provider>;
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  // Fallback so page never crashes even if provider missing
  return ctx ?? { voice: "echo", setVoice: () => {} };
}