import { motion } from 'framer-motion';

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
          href="https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=homepage"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { if (typeof gtag !== 'undefined') gtag('event', 'app_store_click', { link_url: 'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060' }); }}
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
          onClick={() => { if (typeof gtag !== 'undefined') gtag('event', 'play_store_click', { link_url: 'https://play.google.com/store/apps/details?id=com.mastergrowbot.app' }); }}
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

        {/* Web App Button - same row, matching height */}
        <motion.a
          href="https://www.mastergrowbotai.com?utm_source=website&utm_medium=organic&utm_campaign=homepage"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="group relative inline-flex items-center gap-3 h-[65px] sm:h-[70px] px-4 rounded-2xl border border-landing-green/40 bg-black/60 hover:border-landing-green/80 hover:bg-black/80 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-2xl bg-landing-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_16px_2px_rgba(74,222,128,0.25)]" />
          <img
            src="/images/app-icon.png"
            alt="MasterGrowbot AI"
            className="relative w-8 h-8 rounded-lg flex-shrink-0"
            width={32}
            height={32}
          />
          <div className="relative text-left">
            <p className="text-sm font-semibold text-landing-green leading-tight">Open Free Web App</p>
            <p className="text-[10px] text-white/40 leading-tight mt-0.5">No Download Needed</p>
          </div>
        </motion.a>
      </div>

      {/* Shared subtext below all 3 buttons */}
      <p className="text-xs sm:text-sm text-white/50 font-sans">
        Try it Absolutely FREE &bull; Cancel Anytime &bull; No Signup Needed
      </p>
    </div>
  );
}
