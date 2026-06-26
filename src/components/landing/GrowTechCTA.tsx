import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
    'min-h-12 rounded-xl bg-gradient-to-r from-landing-green via-emerald-400 to-lime-300 px-5 py-3.5 text-sm font-extrabold text-black shadow-[0_0_28px_rgba(29,185,84,0.24)] hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(163,230,53,0.32)] focus:ring-lime-300',
  nav:
    'min-h-11 rounded-lg border border-amber-300/50 bg-gradient-to-r from-amber-300/14 via-landing-green/10 to-landing-green/5 px-3 py-1.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(251,191,36,0.12)] hover:-translate-y-0.5 hover:border-amber-300/80 hover:text-amber-100 hover:shadow-[0_0_28px_rgba(251,191,36,0.22)] focus:ring-amber-300/70',
  compact:
    'min-h-11 rounded-xl bg-gradient-to-r from-landing-green via-emerald-400 to-lime-300 px-4 py-2.5 text-sm font-bold text-black shadow-[0_0_22px_rgba(29,185,84,0.2)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(163,230,53,0.28)] focus:ring-lime-300',
  inline:
    'min-h-11 rounded-lg border border-landing-green/35 bg-landing-green/10 px-4 py-2.5 text-sm font-semibold text-landing-green hover:-translate-y-0.5 hover:border-landing-green/60 hover:bg-landing-green/15 focus:ring-landing-green',
};

const badgeStyles: Record<GrowTechCTAVariant, string> = {
  hero: 'border-black/10 bg-black/15 text-black',
  nav: 'border-amber-300/55 bg-amber-300 text-black shadow-[0_0_14px_rgba(251,191,36,0.35)]',
  compact: 'border-black/10 bg-black/15 text-black',
  inline: 'border-lime-300/30 bg-lime-300/10 text-lime-200',
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
        className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${variantStyles[variant]}`}
      >
        <span className="absolute inset-x-3 top-0 h-px bg-white/35" aria-hidden="true" />
        <span>{label}</span>
        {showBadge && (
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide transition-transform duration-200 group-hover:scale-105 ${badgeStyles[variant]}`}
          >
            New Products
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
