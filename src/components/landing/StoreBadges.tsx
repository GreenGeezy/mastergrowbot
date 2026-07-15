import { motion } from 'framer-motion';
import { appStoreUrl, playStoreUrl } from './ctaLinks';
import GrowTechCTA from './GrowTechCTA';

interface StoreBadgesProps {
  className?: string;
  growTechLocation?: string;
  showGrowTech?: boolean;
}

export default function StoreBadges({
  className = '',
  growTechLocation = 'hero:growtech',
  showGrowTech = true,
}: StoreBadgesProps) {
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
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-4 lg:gap-5">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-3 lg:gap-4">
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
                className="relative h-[62px] sm:h-[66px]"
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
                className="relative h-[62px] sm:h-[66px]"
              />
            </motion.a>
          </div>
          <p className="text-center text-xs font-medium text-white/55 sm:text-sm">
            Download and try MasterGrowbot AI free.
          </p>
        </div>

        {showGrowTech ? (
          <GrowTechCTA variant="hero" showSubtext ctaLocation={growTechLocation} className="sm:pt-1" />
        ) : null}
      </div>
    </div>
  );
}
