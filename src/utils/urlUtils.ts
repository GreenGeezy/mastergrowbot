export const getRedirectUrl = () => {
  // Force HTTPS for security
  const protocol = 'https://';
  const hostname = window.location.hostname;
  
  // Handle preview and production URLs
  if (hostname === 'preview--mastergrowbot.lovable.app') {
    return `${protocol}preview--mastergrowbot.lovable.app/auth/callback`;
  }
  if (hostname === 'mastergrowbot.lovable.app') {
    return `${protocol}mastergrowbot.lovable.app/auth/callback`;
  }
  // Local development
  return `${window.location.origin}/auth/callback`;
};