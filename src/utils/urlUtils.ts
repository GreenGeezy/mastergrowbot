
export const getRedirectUrl = () => {
  const hostname = window.location.hostname;
  const origin = window.location.origin;
  
  // For production domain
  if (hostname === 'mastergrowbot.com' || hostname === 'www.mastergrowbot.com') {
    return `${origin}/auth/v1/callback`;
  }
  
  // For development/testing on Lovable subdomain
  if (hostname.includes('lovable.app')) {
    return `${origin}/auth/v1/callback`;
  }
  
  // For Supabase hosted domain
  if (hostname.includes('supabase.co')) {
    return `${origin}/auth/v1/callback`;
  }
  
  // For local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${origin}/auth/v1/callback`;
  }
  
  // Default fallback
  return `${origin}/auth/v1/callback`;
};
