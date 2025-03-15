
/**
 * Get a properly formatted redirect URL for Supabase authentication
 * - In development: Uses localhost with the correct port
 * - In production: Uses the actual domain
 */
export const getRedirectUrl = (): string => {
  // Get current URL information
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // SUPER enhanced preview detection that handles ALL possible Lovable domains
  const isLovablePreview = 
    hostname.includes('lovable.app') || 
    hostname.includes('lovable-') ||
    hostname.includes('lovableproject.com') ||
    (hostname.includes('.vercel.app') && !hostname.includes('mastergrowbot'));
  
  const isMasterGrowbot = hostname.includes('mastergrowbot.com');
  
  // Build the base URL
  let baseUrl = '';
  
  if (isLocalhost) {
    baseUrl = `${protocol}//${hostname}${port}`;
    console.log(`[AUTH] Using localhost URL: ${baseUrl}`);
  } else if (isLovablePreview) {
    // CRITICAL: Always use the exact current origin for preview environments
    baseUrl = window.location.origin;
    console.log(`[AUTH] Using Lovable preview URL: ${baseUrl}`);
    console.log(`[AUTH] Preview detection details:`, {
      hostname,
      origin: window.location.origin,
      isLovableApp: hostname.includes('lovable.app'),
      isLovableProject: hostname.includes('lovableproject.com'),
      isLovableDash: hostname.includes('lovable-'),
      isVercelNonMaster: hostname.includes('.vercel.app') && !hostname.includes('mastergrowbot')
    });
  } else if (isMasterGrowbot) {
    // For production mastergrowbot.com domain
    // IMPORTANT: If not using www subdomain, add it for consistency
    baseUrl = hostname.includes('www.') 
      ? `${protocol}//${hostname}`
      : `${protocol}//www.mastergrowbot.com`;
    console.log(`[AUTH] Using production URL: ${baseUrl}`);
  } else {
    // Fallback to current origin with detailed logging
    baseUrl = window.location.origin;
    console.log(`[AUTH] Using fallback URL: ${baseUrl} (unknown environment)`);
    console.log(`[AUTH] Fallback details:`, {
      hostname,
      origin: window.location.origin,
      protocol
    });
  }
  
  // CRITICAL: Use ONLY this callback path, which must match EXACTLY what's
  // configured in both Supabase URL Configuration and Google OAuth credentials
  const callbackPath = '/auth/callback';
  
  // Very detailed logging for debugging authentication issues
  console.log(`[AUTH] Current hostname: ${hostname}`);
  console.log(`[AUTH] Full window location:`, window.location);
  console.log(`[AUTH] Using base URL: ${baseUrl}`);
  console.log(`[AUTH] Using callback path: ${callbackPath}`);
  
  // Standardize the redirect URL
  const redirectUrl = `${baseUrl}${callbackPath}`;
  console.log(`[AUTH] Generated redirect URL: ${redirectUrl}`);
  
  return redirectUrl;
};
