import { useState, useEffect } from 'react'

export function useAudioState() {
  const [isMuted, setIsMuted] = useState(true)

  // Reset muted state and ensure speech synthesis is cancelled on mount
  useEffect(() => {
    setIsMuted(true)
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speakResponse = (text: string) => {
    // Strict check to ensure audio is explicitly unmuted
    if (isMuted || !window.speakResponse) return
    window.speakResponse(text)
  }

  return {
    isMuted,
    setIsMuted,
    speakResponse
  }
}