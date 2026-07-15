import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import StoreBadges from './StoreBadges';
import DeviceMockup from './DeviceMockup';

const proofPoints = [
  'Photo-based plant diagnosis',
  'Personalized grow plan',
  'Daily journal and strain intelligence',
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 isolate min-h-[calc(100svh-72px)] overflow-hidden border-b border-white/[0.06] px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:flex lg:items-center lg:py-20">
      <img
        src="/images/cultivation-command-center-v2.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-[68%_center] opacity-45 sm:opacity-55"
        width={1792}
        height={1024}
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#010403_0%,rgba(1,4,3,0.96)_36%,rgba(1,4,3,0.48)_68%,rgba(1,4,3,0.72)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_38%,rgba(0,255,102,0.13),transparent_30%),linear-gradient(180deg,transparent_55%,#010302_100%)]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8">
        <motion.div
          className="max-w-3xl text-center lg:text-left"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-landing-green/30 bg-landing-green/[0.09] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-landing-green backdrop-blur-md lg:mx-0">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Your 24/7 AI cultivation assistant
          </div>

          <h1 className="text-balance text-[2.65rem] font-bold leading-[0.98] tracking-[-0.045em] text-white font-sans sm:text-6xl lg:text-[4.65rem] xl:text-[5.25rem]">
            Catch plant problems <span className="text-landing-green">before they cost your harvest.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-xl lg:mx-0 lg:max-w-xl">
            Snap a photo to identify pests, disease, deficiencies, and harvest timing—then get a clear action plan built for your grow.
          </p>

          <ul className="mx-auto mt-6 grid max-w-xl gap-2 text-left text-sm text-white/72 sm:grid-cols-3 lg:mx-0">
            {proofPoints.map((point) => (
              <li key={point} className="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 backdrop-blur-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <StoreBadges className="justify-center lg:justify-start" showGrowTech={false} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-white/56 lg:justify-start">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-landing-green" />3-day free trial</span>
            <span>No credit card to start</span>
            <Link to="/grow-tech" className="group inline-flex items-center gap-1 text-white/72 transition hover:text-landing-green">
              Shop GrowTech <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[670px]"
          initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-10 -z-10 rounded-full bg-landing-green/12 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/[0.1] bg-black/35 p-4 shadow-[0_32px_100px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-black/55 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-landing-green/15 text-landing-green">
                  <ScanLine className="h-5 w-5" aria-hidden="true" />
                  <span className="absolute inset-0 rounded-lg border border-landing-green/30 motion-safe:animate-ping" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-landing-green">Plant scan ready</p>
                  <p className="text-sm font-semibold text-white">Point. Scan. Know what to do next.</p>
                </div>
              </div>
              <span className="hidden rounded-full border border-landing-green/25 bg-landing-green/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-landing-green sm:inline-flex">AI online</span>
            </div>

            <div className="flex items-end justify-center gap-2 sm:gap-4">
              <DeviceMockup src="/images/hero-award-buds.png" alt="MasterGrowbot AI award-winning buds guidance" className="w-[28%] max-w-[180px] -rotate-3 opacity-80" />
              <DeviceMockup src="/images/feature-plant-doctor.png" alt="MasterGrowbot AI plant doctor analyzing a cannabis plant photo" className="z-10 w-[38%] max-w-[240px]" />
              <DeviceMockup src="/images/feature-genetics.png" alt="MasterGrowbot AI strain intelligence database" className="w-[28%] max-w-[180px] rotate-3 opacity-80" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
