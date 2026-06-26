import { Link } from 'react-router-dom';
import { ArrowRight, Camera } from 'lucide-react';
import { GROW_TECH_URL } from './ctaLinks';

type GrowTechCTAVariant = 'hero' | 'nav' | 'compact' | 'inline';

interface GrowTechCTAProps {
  variant?: GrowTechCTAVariant;
  showSubtext?: boolean;
  // Kept for compatibility with older call sites. GrowTech buttons no longer render a badge.
  showBadge?: boolean;
  className?: string;
  ctaLocation?: string;
}

const variantStyles: Record<GrowTechCTAVariant, string> = {
  hero:
    'min-h-[52px] rounded-[18px] border border-purple-400/45 bg-[linear-gradient(135deg,#251044_0%,#08070d_46%,#062513_100%)] px-4 py-3 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(168,85,247,0.22),0_0_28px_rgba(34,197,94,0.14)] hover:-translate-y-0.5 hover:border-lime-300/70 hover:shadow-[0_0_34px_rgba(168,85,247,0.32),0_0_38px_rgba(34,197,94,0.22)] focus:ring-lime-300',
  nav:
    'min-h-10 rounded-xl border border-purple-400/40 bg-[linear-gradient(135deg,#1b0b34_0%,#07070b_50%,#062111_100%)] px-3 py-1.5 text-sm font-bold text-white shadow-[0_0_16px_rgba(168,85,247,0.18),0_0_18px_rgba(34,197,94,0.12)] hover:-translate-y-0.5 hover:border-lime-300/65 hover:text-white hover:shadow-[0_0_24px_rgba(168,85,247,0.26),0_0_26px_rgba(34,197,94,0.18)] focus:ring-lime-300',
  compact:
    'min-h-11 rounded-xl border border-purple-400/40 bg-[linear-gradient(135deg,#251044_0%,#08070d_46%,#062513_100%)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.18),0_0_22px_rgba(34,197,94,0.12)] hover:-translate-y-0.5 hover:border-lime-300/70 hover:shadow-[0_0_30px_rgba(168,85,247,0.28),0_0_30px_rgba(34,197,94,0.18)] focus:ring-lime-300',
  inline:
    'min-h-11 rounded-lg border border-purple-400/35 bg-purple-400/10 px-4 py-2.5 text-sm font-semibold text-lime-200 hover:-translate-y-0.5 hover:border-lime-300/60 hover:bg-landing-green/15 focus:ring-lime-300',
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
        <span className="absolute inset-x-4 top-0 h-px bg-white/35" aria-hidden="true" />
        <span className="absolute inset-x-4 bottom-0 h-px bg-lime-300/45" aria-hidden="true" />
        <span className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-lime-300/18 blur-md" aria-hidden="true" />
        <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-lime-300/45 bg-black/45 text-lime-300 shadow-[0_0_14px_rgba(163,230,53,0.24)]">
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="relative leading-none drop-shadow-[0_0_8px_rgba(163,230,53,0.2)]">{label}</span>
        <ArrowRight className="relative h-4 w-4 text-lime-200 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
      {shouldShowSubtext && (
        <p className="mt-2 text-center text-xs font-medium text-white/65 sm:text-left">{subtextByVariant[variant]}</p>
      )}
    </div>
  );
}
