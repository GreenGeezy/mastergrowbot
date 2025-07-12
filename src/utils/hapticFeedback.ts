// Haptic feedback utility for iOS-like experience
export const hapticFeedback = {
  // Light impact feedback for button taps
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  
  // Medium impact feedback for selections
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
  },
  
  // Heavy impact feedback for important actions
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },
  
  // Success feedback
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },
  
  // Error feedback
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([25, 100, 25, 100, 25]);
    }
  },
  
  // Selection feedback
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  }
};

// Hook for using haptic feedback
export const useHapticFeedback = () => {
  return hapticFeedback;
};