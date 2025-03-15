
/**
 * Get a properly formatted redirect URL for Supabase authentication
 */
export const getRedirectUrl = (): string => {
  // Use the current origin for the redirect
  const baseUrl = window.location.origin;
  const callbackPath = '/auth/callback';
  
  return `${baseUrl}${callbackPath}`;
};

/**
 * Handle OAuth state parameter errors
 */
export const handleOAuthError = (error: string | null, errorDescription: string | null): string | null => {
  if (!error) return null;
  
  return errorDescription || error;
};

/**
 * Generate a consistent state parameter for OAuth
 */
export const generateOAuthState = (): string => {
  return Date.now().toString();
};
