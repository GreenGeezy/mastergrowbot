
export const getRedirectUrl = () => {
  const hostname = window.location.hostname;
  const origin = window.location.origin;
  
  // Logger to help with debugging
  console.log(`[getRedirectUrl] Current hostname: ${hostname}, origin: ${origin}`);
  
  // For production domain and its www subdomain
  if (hostname === 'mastergrowbot.com' || hostname === 'www.mastergrowbot.com') {
    const redirectUrl = `${origin}/auth/v1/callback`;
    console.log(`[getRedirectUrl] Using production redirect URL: ${redirectUrl}`);
    return redirectUrl;
  }
  
  // For preview domains - both Lovable and Vercel
  if (hostname.includes('lovable.app') || 
      hostname.includes('preview--mastergrowbot') || 
      hostname.includes('supabase.co') || 
      hostname.includes('vercel.app')) {
    const redirectUrl = `${origin}/auth/v1/callback`;
    console.log(`[getRedirectUrl] Using preview redirect URL: ${redirectUrl}`);
    return redirectUrl;
  }
  
  // For local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const redirectUrl = `${origin}/auth/v1/callback`;
    console.log(`[getRedirectUrl] Using local redirect URL: ${redirectUrl}`);
    return redirectUrl;
  }
  
  // Default fallback
  const defaultRedirect = `${origin}/auth/v1/callback`;
  console.log(`[getRedirectUrl] Using default redirect URL: ${defaultRedirect}`);
  return defaultRedirect;
};

// Helper function to check if a URL is in the allowed redirects list
export const isAllowedRedirectUrl = (url: string): boolean => {
  const allowedDomains = [
    'mastergrowbot.com',
    'www.mastergrowbot.com',
    'lovable.app',
    'preview--mastergrowbot',
    'supabase.co',
    'vercel.app',
    'localhost',
    '127.0.0.1'
  ];
  
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.includes(domain));
  } catch (e) {
    console.error('[isAllowedRedirectUrl] Invalid URL:', url);
    return false;
  }
};
