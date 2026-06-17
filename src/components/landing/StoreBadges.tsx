import { motion } from 'framer-motion';
import { AmazonBookButton } from './AmazonBookButton';
import { appStoreUrl, playStoreUrl } from './ctaLinks';

interface StoreBadgesProps {
  className?: string;
}

export default function StoreBadges({ className = '' }: StoreBadgesProps) {
  // Convert justify-* to items-* for flex-col alignment, pass other classes through
  const alignItems = className
    .split(' ')
    .filter(c => c.includes('justify-'))
    .map(c => c.replace('justify-', 'items-'))
    .join(' ');

  const otherClasses = className
    .split(' ')
    .filter(c => !c.includes('justify-'))
    .join(' ');

  return (
    <div className={`flex flex-col gap-3 ${alignItems || 'items-center'} ${otherClasses}`}>
      {/* All 3 buttons on the same row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
        <motion.a
          href={appStoreUrl('homepage')}
          data-cta-location="homepage-store-badges:ios"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="group relative"
        >
          <div className="absolute -inset-1 bg-landing-green/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="Download on the App Store"
            className="relative h-[65px] sm:h-[70px]"
          />
        </motion.a>

        <motion.a
          href={playStoreUrl('homepage')}
          data-cta-location="homepage-store-badges:android"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="group relative"
        >
          <div className="absolute -inset-1 bg-landing-green/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            className="relative h-[65px] sm:h-[70px]"
          />
        </motion.a>

        <AmazonBookButton location="homepage-store-badges" />
      </div>

      {/* Shared subtext below all 3 buttons */}
      <p className="text-xs sm:text-sm text-white/50 font-sans">
        Use the app for instant diagnosis. Use the playbook for weekly pest prevention.
      </p>
    </div>
  );
}
