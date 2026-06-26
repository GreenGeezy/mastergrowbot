import { Link } from 'react-router-dom';
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
    'h-[54px] sm:h-[56px]',
  nav:
    'h-[38px] sm:h-[40px]',
  compact:
    'h-[46px]',
  inline:
    'h-[42px]',
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
        aria-label={label}
        className="group relative inline-flex items-center justify-center rounded-full bg-black leading-none transition-all duration-200 hover:-translate-y-0.5 hover:drop-shadow-[0_0_22px_rgba(168,85,247,0.38)] focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-black"
      >
        <span className="sr-only">{label}</span>
        <img
          src="/images/grow-tech/ShopGrowTechButton.png"
          alt=""
          aria-hidden="true"
          className={`w-auto rounded-full bg-black object-contain transition-transform duration-200 group-hover:scale-[1.02] ${variantStyles[variant]}`}
          loading={variant === 'hero' ? 'eager' : 'lazy'}
        />
      </Link>
      {shouldShowSubtext && (
        <p className="mt-2 text-center text-xs font-medium text-white/65 sm:text-left">{subtextByVariant[variant]}</p>
      )}
    </div>
  );
}
