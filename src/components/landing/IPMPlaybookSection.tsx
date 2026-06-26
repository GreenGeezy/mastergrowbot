import { AmazonBookButton } from './AmazonBookButton';

const ipmImages: Array<{ src: string; alt: string }> = [];

export default function IPMPlaybookSection() {
  const hasIpmImages = ipmImages.length > 0;

  return (
    <section id="ipm-playbook" className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
      <div
        className={`mx-auto grid max-w-6xl grid-cols-1 gap-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] via-landing-green/[0.045] to-black/20 p-6 shadow-2xl shadow-landing-green/10 backdrop-blur-xl lg:p-8 ${
          hasIpmImages ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''
        }`}
      >
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green font-sans">
            IPM PLAYBOOK
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white font-sans sm:text-4xl">
            Stop Pest Outbreaks Before They Cost You Yield
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/62 font-sans">
            A visual IPM field manual for legal cannabis growers who want cleaner prevention, faster scouting, and
            better grow documentation.
          </p>
          <div className="mt-6">
            <AmazonBookButton location="homepage-ipm-playbook" />
            <p className="mt-2 text-sm font-medium text-white/52 font-sans">
              The Master Cannabis IPM Playbook for legal growers
            </p>
          </div>
        </div>

        {hasIpmImages && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:items-center">
            {ipmImages.map((image) => (
              <div
                key={image.src}
                className="overflow-hidden rounded-xl border border-landing-green/15 bg-black/35 shadow-xl shadow-landing-green/10"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full max-h-[260px] w-full object-cover"
                  width={360}
                  height={260}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
