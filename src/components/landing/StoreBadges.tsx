import { motion } from 'framer-motion';

interface StoreBadgesProps {
  className?: string;
}

export default function StoreBadges({ className = '' }: StoreBadgesProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      <motion.a
        href="https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=homepage"
        target="_blank"
        rel="noopener noreferrer"
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
        href="https://play.google.com/store/apps/details?id=com.mastergrowbot.app&utm_source=website&utm_medium=organic&utm_campaign=homepage"
        target="_blank"
        rel="noopener noreferrer"
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
    </div>
  );
}
