import { Camera, Clock3, Sprout, Target } from 'lucide-react';

const outcomes = [
  { icon: Camera, value: '1 photo', label: 'to start a plant-health scan' },
  { icon: Clock3, value: '24/7', label: 'cultivation guidance in your pocket' },
  { icon: Sprout, value: 'Every stage', label: 'from seedling through harvest' },
  { icon: Target, value: 'Your grow', label: 'advice calibrated to your setup' },
];

export default function TrustRail() {
  return (
    <section className="relative z-20 border-b border-white/[0.06] bg-[#020605] px-4 py-5 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
        {outcomes.map(({ icon: Icon, value, label }) => (
          <div key={value} className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 sm:p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-landing-green/10 text-landing-green"><Icon className="h-4 w-4" aria-hidden="true" /></span>
            <div>
              <p className="text-sm font-bold text-white sm:text-base">{value}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/48">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
