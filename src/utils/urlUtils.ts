
/**
 * Utility to dynamically generate redirect URLs for authentication
 * based on the current environment and domain
 */
export const getRedirectUrl = () => {
  const hostname = window.location.hostname;
  const origin = window.location.origin;
  
  // For production domain
  if (hostname === 'mastergrowbot.com' || hostname === 'www.mastergrowbot.com') {
    return `${origin}/auth/callback`;
  }
  
  // For Lovable preview deployments with double hyphens
  // These can't be added to Google Cloud Console due to domain validation rules
  if (hostname.includes('preview--') && hostname.includes('lovable.app')) {
    // Fallback to the main domain for OAuth redirects while still on preview deployment
    return 'https://www.mastergrowbot.com/auth/callback';
  }
  
  // For other Lovable subdomain
  if (hostname.includes('lovable.app')) {
    return `${origin}/auth/callback`;
  }
  
  // For Supabase hosted domain
  if (hostname.includes('supabase.co')) {
    return `${origin}/auth/callback`;
  }
  
  // For local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${origin}/auth/callback`;
  }
  
  // Default fallback
  return `${origin}/auth/callback`;
};
