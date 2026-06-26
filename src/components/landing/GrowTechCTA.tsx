import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { GROW_TECH_URL } from './ctaLinks';

type GrowTechCTAVariant = 'hero' | 'nav' | 'compact' | 'inline';

interface GrowTechCTAProps {
  variant?: GrowTechCTAVariant;
  showSubtext?: boolean;
  showBadge?: boolean;
  className?: string;
  ctaLocation?: string;
}

const variantStyles: Record<GrowTechCTAVariant, string> = {
  hero:
    'min-h-[52px] rounded-2xl border border-landing-green/45 bg-gradient-to-r from-[#06150c] via-[#0b2a17] to-[#12351f] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_0_28px_rgba(34,197,94,0.18)] hover:-translate-y-0.5 hover:border-landing-green/80 hover:shadow-[0_0_36px_rgba(34,197,94,0.32)] focus:ring-landing-green',
  nav:
    'min-h-11 rounded-xl border border-landing-green/35 bg-gradient-to-r from-[#06150c] via-[#0a2414] to-black/80 px-3 py-1.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(34,197,94,0.14)] hover:-translate-y-0.5 hover:border-landing-green/70 hover:text-white hover:shadow-[0_0_26px_rgba(34,197,94,0.24)] focus:ring-landing-green',
  compact:
    'min-h-11 rounded-xl border border-landing-green/40 bg-gradient-to-r from-[#06150c] via-[#0b2a17] to-[#12351f] px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(34,197,94,0.16)] hover:-translate-y-0.5 hover:border-landing-green/75 hover:shadow-[0_0_28px_rgba(34,197,94,0.26)] focus:ring-landing-green',
  inline:
    'min-h-11 rounded-lg border border-landing-green/35 bg-landing-green/10 px-4 py-2.5 text-sm font-semibold text-landing-green hover:-translate-y-0.5 hover:border-landing-green/60 hover:bg-landing-green/15 focus:ring-landing-green',
};

const badgeStyles: Record<GrowTechCTAVariant, string> = {
  hero: 'border-amber-300/35 bg-amber-300/12 text-amber-100',
  nav: 'border-amber-300/35 bg-amber-300/12 text-amber-100',
  compact: 'border-amber-300/35 bg-amber-300/12 text-amber-100',
  inline: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
};

const subtextByVariant: Record<GrowTechCTAVariant, string> = {
  hero: 'AI-ready tools for better plant scans',
  nav: 'AI-ready tools for better plant scans',
  compact: 'Upgrade plant scans with AI-ready grow tools',
  inline: 'Better AI plant scans',
};

export default function GrowTechCTA({
  variant = 'hero',
  showSubtext,
  showBadge = true,
  className = '',
  ctaLocation = 'unknown:growtech',
}: GrowTechCTAProps) {
  const label = variant === 'nav' ? 'GrowTech Shop' : 'Shop GrowTech';
  const shouldShowSubtext = showSubtext ?? variant === 'hero';

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <Link
        to={GROW_TECH_URL}
        data-cta-location={ctaLocation}
        className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${variantStyles[variant]}`}
      >
        <span className="absolute inset-x-3 top-0 h-px bg-landing-green/45" aria-hidden="true" />
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-landing-green/25 bg-landing-green/12 text-landing-green">
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="leading-none">{label}</span>
        {showBadge && (
          <span
            className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] transition-transform duration-200 group-hover:scale-105 ${badgeStyles[variant]}`}
          >
            NEW PRODUCTS
          </span>
        )}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
      {shouldShowSubtext && (
        <p className="mt-2 text-center text-xs font-medium text-white/65 sm:text-left">{subtextByVariant[variant]}</p>
      )}
    </div>
  );
}
