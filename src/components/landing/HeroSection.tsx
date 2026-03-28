import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
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
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
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

          {/* Social Proof */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <span className="text-sm font-medium text-white/70 font-sans">
              Trusted by Elite Growers Worldwide
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-white font-sans">
            Save your harvest in seconds with a single pic
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Turn your smartphone into a 24/7 master grower. Instantly diagnose pests, fix nutrient lockouts, and maximize your yield before a single mistake ruins your run.
          </p>

          <StoreBadges className="justify-center lg:justify-start pt-2" />

          <p className="text-xs sm:text-sm text-center lg:text-left text-white/50 font-sans mt-3">
            Start your Free Trial today Risk Free! <span className="hidden sm:inline"></span>
            <br className="sm:hidden" />
            No Sign Up required &bull; Cancel anytime
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
          <div className="flex items-center justify-center gap-2 sm:gap-4 w-full lg:max-w-2xl mx-auto">
            <DeviceMockup
              src="/images/hero-award-buds.png"
              alt="MasterGrowbot AI cannabis app for growing award winning buds"
              className="w-[30%] max-w-[210px] transform -rotate-2 lg:rotate-y-6 opacity-90 transition-transform duration-500 hover:scale-105 hover:z-20 hover:opacity-100"
            />
            <DeviceMockup
              src="/images/feature-plant-doctor.png"
              alt="MasterGrowbot AI cannabis plant doctor scanning for pests and deficiencies"
              className="w-[35%] max-w-[245px] transform lg:rotate-y-3 z-10 shadow-2xl transition-transform duration-500 hover:scale-105"
            />
            <DeviceMockup
              src="/images/feature-genetics.png"
              alt="MasterGrowbot AI cannabis strain genetics database"
              className="w-[30%] max-w-[210px] transform rotate-2 lg:-rotate-y-6 opacity-90 transition-transform duration-500 hover:scale-105 hover:z-20 hover:opacity-100"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
