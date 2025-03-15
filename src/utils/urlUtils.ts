
/**
 * Get a properly formatted redirect URL for Supabase authentication
 * - In development: Uses localhost with the correct port
 * - In production: Uses the actual domain
 */
export const getRedirectUrl = (): string => {
  const isLocalhost = window.location.hostname === 'localhost' 
    || window.location.hostname === '127.0.0.1';
  
  // Special case for Lovable preview URLs
  const isLovablePreview = window.location.hostname.includes('lovableproject.com');
  
  // Get the protocol (http or https)
  const protocol = window.location.protocol;
  
  // Get the port if it's not the default (80 for http, 443 for https)
  const port = window.location.port ? `:${window.location.port}` : '';
  
  // Build URL for various environments
  let redirectUrl = '';
  
  if (isLocalhost) {
    // For localhost, use the current origin
    redirectUrl = `${protocol}//${window.location.hostname}${port}`;
  } else if (isLovablePreview) {
    // For Lovable previews, use the full current URL
    redirectUrl = window.location.origin;
  } else {
    // For production, always use the main domain
    redirectUrl = `https://www.mastergrowbot.com`;
  }
  
  console.log(`[urlUtils] Generated redirect URL: ${redirectUrl}`);
  
  return redirectUrl;
};
