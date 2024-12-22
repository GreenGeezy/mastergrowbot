import { useState, useEffect } from 'react'

export function useAudioState() {
  // Initialize muted state to true by default
  const [isMuted, setIsMuted] = useState(true)

  // Reset muted state and ensure speech synthesis is cancelled on mount
  useEffect(() => {
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
    // Only speak if audio is explicitly unmuted
    if (isMuted || !window.speakResponse) return
    window.speakResponse(text)
  }

  return {
    isMuted,
    setIsMuted,
    speakResponse
  }
}