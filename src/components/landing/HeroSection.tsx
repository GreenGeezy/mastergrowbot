import { motion } from 'framer-motion';
import StoreBadges from './StoreBadges';
import DeviceMockup from './DeviceMockup';

export default function HeroSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Copy */}
        <motion.div
          className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <img
              src="/images/app-icon.png"
              alt="MasterGrowbot AI Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl"
              width={56}
              height={56}
            />
            <span className="text-lg sm:text-xl font-semibold tracking-wide text-white/90 font-sans">
              MasterGrowbot AI
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-white font-sans">
            The World's Most Advanced{' '}
            <span className="text-landing-green">AI Cultivation</span>{' '}
            Assistant
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Bridge the gap between complex botanical science and craft cannabis cultivation. Your 24/7 diagnostic engine.
          </p>

          <StoreBadges className="justify-center lg:justify-start pt-2" />

          <p className="text-sm text-white/30 font-sans">
            Start your 3-Day Free Trial today.
          </p>
        </motion.div>

        {/* Hero Device */}
        <motion.div
          className="order-1 lg:order-2 flex justify-center"
          initial={{ opacity: 0, y: 50, rotateY: -8 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200 }}
        >
          <DeviceMockup
            src="/images/hero-award-buds.png"
            alt="MasterGrowbot AI - Grow Award Winning Buds"
            className="transform lg:rotate-y-3 lg:scale-110"
          />
        </motion.div>
      </div>
    </section>
  );
}
