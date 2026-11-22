import ScrollReveal from './ScrollReveal';
import StoreBadges from './StoreBadges';

export default function ConversionBanner() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto text-center rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-xl p-10 sm:p-16 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-landing-green font-sans">
            Find the Perfect Genetics with our AI Strain Intelligence
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto font-sans">
            Stop guessing. Start optimizing.
          </p>
          <StoreBadges className="justify-center pt-4" />
        </div>
      </ScrollReveal>
    </section>
  );
}
