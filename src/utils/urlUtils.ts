
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
  
  // Get the pathname up to the first segment to support subdirectory deployments
  const pathSegments = window.location.pathname.split('/');
  const basePath = pathSegments.length > 1 && pathSegments[1] ? `/${pathSegments[1]}` : '';
  
  // Build URL for various environments
  let redirectUrl = '';
  
  if (isLocalhost) {
    // For localhost, use the current origin
    redirectUrl = `${protocol}//${window.location.hostname}${port}`;
  } else if (isLovablePreview) {
    // For Lovable previews, use the full current URL
    redirectUrl = window.location.origin;
  } else {
    // For production, use the main domain with subdirectory if present
    const isSubdirectory = window.location.pathname.startsWith('/app');
    redirectUrl = isSubdirectory 
      ? `https://www.mastergrowbot.com/app` 
      : `https://www.mastergrowbot.com`;
  }
  
  // Log the redirect URL for debugging
  console.log(`[urlUtils] Generated redirect URL: ${redirectUrl}`);
  
  return redirectUrl;
};
