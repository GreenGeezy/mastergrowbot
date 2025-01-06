export const getRedirectUrl = () => {
  const hostname = window.location.hostname;
  
  // For development/testing on Lovable subdomain
  if (hostname.includes('mastergrowbot.lovable.app')) {
    return `${window.location.origin}/auth/callback`;
  }
  
  // For production domain
  if (hostname.includes('mastergrowbot.com')) {
    return `${window.location.origin}/auth/callback`;
  }
  
  // For Supabase hosted domain
  if (hostname.includes('supabase.co')) {
    return `${window.location.origin}/auth/v1/callback`;
  }
  
  // Default case - will handle both www and non-www versions
  return `${window.location.origin}/auth/callback`;
};