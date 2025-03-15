
/**
 * Get a properly formatted redirect URL for Supabase authentication
 * - In development: Uses localhost with the correct port
 * - In production: Uses the actual domain
 * - In preview: Uses the exact current URL
 */
export const getRedirectUrl = (): string => {
  // Always use the current origin for the redirect
  const baseUrl = window.location.origin;
  
  // Standard callback path that must match Supabase and Google OAuth settings
  const callbackPath = '/auth/callback';
  
  // Detailed logging to help diagnose auth issues
  console.log(`[AUTH] Environment detection:`, {
    origin: window.location.origin,
    hostname: window.location.hostname,
    currentUrl: window.location.href
  });
  console.log(`[AUTH] Using base URL: ${baseUrl}`);
  console.log(`[AUTH] Using callback path: ${callbackPath}`);
  
  const redirectUrl = `${baseUrl}${callbackPath}`;
  console.log(`[AUTH] Generated redirect URL: ${redirectUrl}`);
  
  return redirectUrl;
};

/**
 * Handle OAuth state parameter errors
 * This helps debug and recover from common OAuth errors
 */
export const handleOAuthError = (error: string | null, errorDescription: string | null): string | null => {
  if (!error) return null;
  
  console.error(`[AUTH] OAuth error: ${error}, description: ${errorDescription}`);
  
  if (error === 'bad_oauth_state' || error === 'invalid_request') {
    return "Authentication failed. Please try again and ensure you complete the Google login process.";
  }
  
  return errorDescription || error;
};
