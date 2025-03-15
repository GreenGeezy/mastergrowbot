
/**
 * Get a properly formatted redirect URL for Supabase authentication
 * - In development: Uses localhost with the correct port
 * - In production: Uses the actual domain
 * - In preview: Uses the exact current URL
 */
export const getRedirectUrl = (): string => {
  // Get current URL information
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // CRITICAL: Always use the CURRENT URL for OAuth redirects
  // This ensures preview environments always redirect back to themselves
  const baseUrl = window.location.origin;
  
  // Standard callback path that must match Supabase and Google OAuth settings
  const callbackPath = '/auth/callback';
  
  // Detailed logging to help diagnose auth issues
  console.log(`[AUTH] Environment detection:`, {
    origin: window.location.origin,
    hostname,
    isLocalhost,
    currentUrl: window.location.href
  });
  console.log(`[AUTH] Using base URL: ${baseUrl}`);
  console.log(`[AUTH] Using callback path: ${callbackPath}`);
  
  // Always use the current origin for the redirect
  const redirectUrl = `${baseUrl}${callbackPath}`;
  console.log(`[AUTH] Generated redirect URL: ${redirectUrl}`);
  
  return redirectUrl;
};
