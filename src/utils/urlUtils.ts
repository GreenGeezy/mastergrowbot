export const getRedirectUrl = () => {
  // For production
  if (window.location.hostname === 'www.mastergrowbot.com') {
    return `${window.location.origin}/auth/callback`;
  }
  
  // For development
  return `${window.location.origin}/auth/callback`;
};