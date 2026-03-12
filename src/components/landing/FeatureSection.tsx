import ScrollReveal from './ScrollReveal';
import DeviceMockup from './DeviceMockup';

const features = [
  {
    headline: 'Save your plants in seconds with a single pic.',
    body: 'Using advanced multimodal AI, identify pests, diseases, and nutrient deficiencies with high confidence. A second set of expert eyes that never sleeps.',
    image: '/images/feature-plant-doctor.png',
    imageAlt: 'Instant AI Plant Doctor',
    imagePosition: 'right' as const,
  },
  {
    headline: 'Personalized to your exact genetics.',
    body: 'Upon onboarding, the AI calibrates to your specific environment and experience level. Get real-time health scores and optimal harvest windows tailored to your plant.',
    image: '/images/feature-grow-plans.png',
    imageAlt: 'Custom AI Grow Plans',
    imagePosition: 'left' as const,
  },
];

export default function FeatureSection() {
  return (
    <section className="relative z-10 py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-24 sm:space-y-36">
        {features.map((feature, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
              feature.imagePosition === 'left' ? '' : ''
            }`}
          >
            {/* Text Card */}
            <ScrollReveal
              className={`${feature.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'}`}
              delay={0.1}
            >
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 space-y-5">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
                  {feature.headline}
                </h2>
                <p className="text-base sm:text-lg text-white/55 leading-relaxed font-sans">
                  {feature.body}
                </p>
              </div>
            </ScrollReveal>

            {/* Image */}
            <div className={`${feature.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'} flex justify-center`}>
              <DeviceMockup
                src={feature.image}
                alt={feature.imageAlt}
              />
            </div>
          </div>
        ))}

        {/* Feature 3 - Strain Intelligence with overlapping images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal className="lg:order-1" delay={0.1}>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 space-y-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
                Master any genetic.
              </h2>
              <p className="text-base sm:text-lg text-white/55 leading-relaxed font-sans">
                Explore a massive global database or add your own bag seeds. The AI generates specialized, structured cultivation advice tailored to that exact genetic profile.
              </p>
            </div>
          </ScrollReveal>

          {/* Overlapping devices */}
          <div className="lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[500px]">
              <div className="relative -left-4 sm:-left-6 z-10">
                <DeviceMockup
                  src="/images/feature-genetics.png"
                  alt="Find the Perfect Genetics"
                  className="max-w-[240px] sm:max-w-[270px]"
                />
              </div>
              <div className="absolute top-12 right-0 sm:right-4 z-20">
                <DeviceMockup
                  src="/images/feature-strain-intel.png"
                  alt="AI Strain Intelligence"
                  className="max-w-[220px] sm:max-w-[250px]"
                  glowColor="rgba(29, 185, 84, 0.15)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
