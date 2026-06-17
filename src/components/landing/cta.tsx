import { ArrowRight, Star } from 'lucide-react';
import { appStoreUrl, playStoreUrl } from './ctaLinks';

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
