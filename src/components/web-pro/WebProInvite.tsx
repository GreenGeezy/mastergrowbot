import { Link } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { webProLive } from '@/lib/webPro';

/**
 * Desktop only, and always below the app buttons: phone visitors keep one clear choice, the app.
 * Renders nothing until Web Pro is on sale.
 */
export default function WebProInvite({ location, align = 'center' }: { location: string; align?: 'center' | 'left' }) {
  if (!webProLive) return null;
  return (
    <p className={`mt-4 hidden items-center ${align === 'left' ? 'justify-start' : 'justify-center'} gap-2 border-t border-white/10 pt-4 font-sans text-sm text-white/60 lg:flex`}>
      <Monitor className="h-4 w-4 shrink-0 text-white/45" aria-hidden="true" /> At your computer?
      <Link to="/pro" data-cta-location={`${location}:web-pro`} onClick={() => trackEvent('web_pro_invite_click', { cta_location: location })} className="font-semibold text-landing-green hover:underline">
        Get photo reports in your browser with Web Pro
      </Link>
    </p>
  );
}
