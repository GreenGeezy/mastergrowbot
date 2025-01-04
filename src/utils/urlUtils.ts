export const getRedirectUrl = () => {
  // Force HTTPS for security
  const protocol = 'https://';
  const hostname = window.location.hostname;
  
  // Handle production URL
  if (hostname === 'www.mastergrowbot.com') {
    return `${protocol}www.mastergrowbot.com/auth/callback`;
  }
  // Handle preview URL (keep for development)
  if (hostname === 'preview--mastergrowbot.lovable.app') {
    return `${protocol}preview--mastergrowbot.lovable.app/auth/callback`;
  }
  // Local development
  return `${window.location.origin}/auth/callback`;
};
