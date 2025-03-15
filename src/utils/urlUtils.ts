
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
  const isLovablePreview = hostname.includes('lovableproject.com');
  const isMasterGrowbot = hostname.includes('mastergrowbot.com');
  
  // Build the base URL
  let baseUrl = '';
  
  if (isLocalhost) {
    baseUrl = `${protocol}//${hostname}${port}`;
  } else if (isLovablePreview) {
    baseUrl = window.location.origin;
  } else if (isMasterGrowbot) {
    // IMPORTANT: Always use the www subdomain for consistency
    baseUrl = 'https://www.mastergrowbot.com';
  } else {
    // Fallback to current origin
    baseUrl = window.location.origin;
  }
  
  // CRITICAL: Use ONLY this callback path, which must match EXACTLY what's
  // configured in both Supabase URL Configuration and Google OAuth credentials
  const callbackPath = '/auth/callback';
  
  // Very detailed logging for debugging authentication issues
  console.log(`[AUTH] Current hostname: ${hostname}`);
  console.log(`[AUTH] Full window location:`, window.location);
  console.log(`[AUTH] Using base URL: ${baseUrl}`);
  console.log(`[AUTH] Using callback path: ${callbackPath}`);
  
  // Standardize the redirect URL - this must match exactly what's configured in both
  // Supabase URL Configuration and Google OAuth redirect URIs
  const redirectUrl = `${baseUrl}${callbackPath}`;
  
  console.log(`[AUTH] Generated redirect URL: ${redirectUrl}`);
  
  return redirectUrl;
};
