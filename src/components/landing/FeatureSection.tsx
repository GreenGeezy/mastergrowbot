import ScrollReveal from './ScrollReveal';
import DeviceMockup from './DeviceMockup';
import StoreBadges from './StoreBadges';

export default function FeatureSection() {
  return (
    <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-24 sm:space-y-36">
        
        {/* Row 1: Text Left, Image Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal className="order-1 space-y-6">
            <span className="text-landing-green font-semibold tracking-wider uppercase text-sm">Vision AI Diagnostics</span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
              Stop Yield-Killing Threats Before They Spread
            </h3>
            <p className="text-base sm:text-lg text-white/60 leading-relaxed font-sans">
              A single spider mite or subtle pH lockout can ruin months of work. Snap a photo of any leaf, and our vision AI instantly identifies the exact pest or deficiency, giving you a step-by-step recovery plan to save your harvest.
            </p>
            <div className="pt-2">
              <StoreBadges className="justify-start pt-2" />
              <p className="text-xs sm:text-sm text-left text-white/50 font-sans mt-3">
                Start your Free Trial today Risk Free! <span className="hidden sm:inline"></span>
                <br className="sm:hidden" />
                No Sign Up required &bull; Cancel anytime
              </p>
            </div>
          </ScrollReveal>
          <div className="order-2 flex justify-center">
            <DeviceMockup src="/images/feature-plant-doctor.png" alt="MasterGrowbot AI vision diagnostics identifying cannabis pest and nutrient deficiency" className="max-w-[280px] sm:max-w-[320px] md:max-w-md w-full" />
          </div>
        </div>

        {/* Row 2: Image Left, Text Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image is first in DOM, but second on mobile, first on desktop */}
          <div className="order-2 md:order-1 flex justify-center">
            <DeviceMockup src="/images/feature-strain-intel.png" alt="MasterGrowbot AI cannabis strain intelligence and genetics tracking" className="max-w-[280px] sm:max-w-[320px] md:max-w-md w-full" />
          </div>
          {/* Text is second in DOM, but first on mobile, second on desktop */}
          <ScrollReveal className="order-1 md:order-2 space-y-6">
            <span className="text-landing-green font-semibold tracking-wider uppercase text-sm">AI Strain Intelligence</span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
              Perfect Your Proprietary Genetics
            </h3>
            <p className="text-base sm:text-lg text-white/60 leading-relaxed font-sans">
              Whether you are hunting elite phenos or dialing in a custom cross, MasterGrowbot tracks your exact strain data. Achieve flawless batch-to-batch consistency and push your yields to their absolute genetic maximum.
            </p>
            <div className="pt-2">
              <StoreBadges className="justify-start pt-2" />
              <p className="text-xs sm:text-sm text-left text-white/50 font-sans mt-3">
                Start your Free Trial today Risk Free! <span className="hidden sm:inline"></span>
                <br className="sm:hidden" />
                No Sign Up required &bull; Cancel anytime
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Row 3: Text Left, Image Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal className="order-1 space-y-6">
            <span className="text-landing-green font-semibold tracking-wider uppercase text-sm">Expert Grow Consultant</span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
              A Master Grower in Your Pocket, 24/7
            </h3>
            <p className="text-base sm:text-lg text-white/60 leading-relaxed font-sans">
              Stop second-guessing your environmental inputs. Get a relentless, expert set of eyes on your canopy at all times—mitigating risk and optimizing growth without paying thousands for a human consultant.
            </p>
            <div className="pt-2">
              <StoreBadges className="justify-start pt-2" />
              <p className="text-xs sm:text-sm text-left text-white/50 font-sans mt-3">
                Start your Free Trial today Risk Free! <span className="hidden sm:inline"></span>
                <br className="sm:hidden" />
                No Sign Up required &bull; Cancel anytime
              </p>
            </div>
          </ScrollReveal>
          <div className="order-2 flex justify-center">
            <DeviceMockup src="/images/feature-grow-plans.png" alt="MasterGrowbot AI expert cannabis grow consultant and daily task planner" className="max-w-[280px] sm:max-w-[320px] md:max-w-md w-full" />
          </div>
        </div>

      </div>
    </section>
  );
}
