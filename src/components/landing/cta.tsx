import { ArrowRight, BookOpen, Star } from 'lucide-react';
import { AMAZON_BOOK_URL, appStoreUrl, playStoreUrl } from './ctaLinks';

interface RatingStarsProps {
  className?: string;
  iconClassName?: string;
}

export function RatingStars({ className = '', iconClassName = 'w-4 h-4' }: RatingStarsProps) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${iconClassName} fill-yellow-500 text-yellow-500`} />
      ))}
    </div>
  );
}

interface AppPlatformButtonsProps {
  campaign: string;
  location: string;
  className?: string;
}

export function AppPlatformButtons({ campaign, location, className = '' }: AppPlatformButtonsProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 ${className}`}>
      <a
        href={appStoreUrl(campaign)}
        data-cta-location={`${location}:ios`}
        className="flex items-center justify-center gap-2 rounded-xl bg-landing-green px-5 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-landing-green/90 font-sans"
      >
        Get instant AI plant diagnosis on iOS
        <ArrowRight className="h-4 w-4" />
      </a>
      <a
        href={playStoreUrl(campaign)}
        data-cta-location={`${location}:android`}
        className="flex items-center justify-center gap-2 rounded-xl border border-landing-green/30 bg-black/40 px-5 py-3 text-sm font-semibold text-white/80 transition-colors duration-200 hover:border-landing-green/60 hover:text-white font-sans"
      >
        Get instant AI plant diagnosis on Android
      </a>
    </div>
  );
}

interface AmazonBookBadgeProps {
  location: string;
  className?: string;
  compact?: boolean;
}

export function AmazonBookBadge({ location, className = '', compact = false }: AmazonBookBadgeProps) {
  return (
    <a
      href={AMAZON_BOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cta-location={`${location}:amazon-book`}
      className={`group relative inline-flex items-center gap-3 rounded-2xl border border-landing-green/40 bg-black/60 px-4 transition-all duration-300 hover:border-landing-green/80 hover:bg-black/80 ${compact ? 'py-3' : 'h-[65px] sm:h-[70px]'} ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-landing-green/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -inset-px rounded-2xl opacity-0 shadow-[0_0_16px_2px_rgba(74,222,128,0.25)] transition-opacity duration-300 group-hover:opacity-100" />
      <BookOpen className="relative h-8 w-8 flex-shrink-0 text-landing-green" />
      <div className="relative text-left">
        <p className="text-sm font-semibold leading-tight text-landing-green">IPM Playbook</p>
        <p className="mt-0.5 text-[10px] leading-tight text-white/55">Available on Amazon</p>
      </div>
    </a>
  );
}
