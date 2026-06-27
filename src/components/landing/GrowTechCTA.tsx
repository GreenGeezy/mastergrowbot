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
    'h-[108px] sm:h-[112px]',
  nav:
    'h-[76px] sm:h-[80px]',
  compact:
    'h-[92px]',
  inline:
    'h-[84px]',
};

const subtextByVariant: Record<GrowTechCTAVariant, string> = {
  hero: 'AI Intelligent GrowTech for growers of all types and experience levels',
  nav: 'AI Intelligent GrowTech for every grower',
  compact: 'AI Intelligent GrowTech for growers of all types and experience levels',
  inline: 'AI Intelligent GrowTech for every grower',
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
