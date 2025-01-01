export const getRedirectUrl = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('preview--mastergrowbot.lovable.app')) {
    return 'https://preview--mastergrowbot.lovable.app/auth/callback';
  }
  if (hostname.includes('mastergrowbot.lovable.app')) {
    return 'https://mastergrowbot.lovable.app/auth/callback';
  }
  return `${window.location.origin}/auth/callback`;
};