
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
    // Fixed URL for production
    baseUrl = `https://www.mastergrowbot.com`;
  } else {
    // Fallback to current origin
    baseUrl = window.location.origin;
  }
  
  // Support multiple callback paths - allowing both /auth/callback and /auth/v1/callback
  // This ensures compatibility with both the main and paid-version branches
  // We'll try to detect which one works based on the URL
  const path = window.location.pathname;
  
  // Default callback path - use v1 by default since it's what's fully configured
  let callbackPath = '/auth/v1/callback';
  
  // Add more detailed logging for debugging authentication issues
  console.log(`[AUTH] Current pathname: ${path}`);
  console.log(`[AUTH] Current hostname: ${hostname}`);
  console.log(`[AUTH] Using base URL: ${baseUrl}`);
  console.log(`[AUTH] Using callback path: ${callbackPath}`);
  
  // Standardize for callback URI - Supabase requires the exact path configured in the dashboard
  const redirectUrl = `${baseUrl}${callbackPath}`;
  
  console.log(`[AUTH] Generated redirect URL: ${redirectUrl}`);
  
  return redirectUrl;
};
