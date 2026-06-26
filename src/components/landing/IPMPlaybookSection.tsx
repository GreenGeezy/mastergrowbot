import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AmazonBookButton } from './AmazonBookButton';

const ipmImages = [
  {
    src: '/images/A%2BKDPImage1.png',
    fallbackSrc: '/images/A+KDPImage1.png',
    alt: 'The Master Cannabis IPM Playbook cover and pest prevention headline',
  },
  {
    src: '/images/A%2BKDPImage4.png',
    fallbackSrc: '/images/A+KDPImage4.png',
    alt: 'Four cannabis pest and disease threats from the IPM Playbook',
  },
  {
    src: '/images/A%2BKDPImage5.png',
    fallbackSrc: '/images/A+KDPImage5.png',
    alt: 'Print-ready SOPs, checklists, and scouting logs from the IPM Playbook',
  },
];

export default function IPMPlaybookSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = ipmImages[activeIndex];

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + ipmImages.length) % ipmImages.length);
  };

  return (
    <section id="ipm-playbook" className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] via-landing-green/[0.045] to-black/20 p-6 shadow-2xl shadow-landing-green/10 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
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

        <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-end">
          <div className="relative overflow-hidden rounded-xl border border-landing-green/20 bg-black/45 shadow-2xl shadow-landing-green/10">
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              loading="lazy"
              width={520}
              height={320}
              className="h-[260px] w-full object-contain p-2 sm:h-[320px]"
              onError={(event) => {
                const image = event.currentTarget;
                if (image.dataset.fallbackUsed !== 'true') {
                  image.dataset.fallbackUsed = 'true';
                  image.src = activeImage.fallbackSrc;
                }
              }}
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => move(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/65 text-white/70 backdrop-blur transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green"
                aria-label="Previous IPM Playbook image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/65 text-white/70 backdrop-blur transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green"
                aria-label="Next IPM Playbook image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {ipmImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-xl border bg-black/45 p-1 transition focus:outline-none focus:ring-2 focus:ring-landing-green ${
                  index === activeIndex
                    ? 'border-landing-green/55 shadow-[0_0_18px_rgba(34,197,94,0.18)]'
                    : 'border-white/10 hover:border-landing-green/30'
                }`}
                aria-label={`Show IPM Playbook image ${index + 1}`}
              >
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  width={160}
                  height={96}
                  className="h-16 w-full rounded-lg object-cover sm:h-20"
                  onError={(event) => {
                    const thumbnail = event.currentTarget;
                    if (thumbnail.dataset.fallbackUsed !== 'true') {
                      thumbnail.dataset.fallbackUsed = 'true';
                      thumbnail.src = image.fallbackSrc;
                    }
                  }}
                />
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {ipmImages.map((image, index) => (
              <button
                key={`${image.src}-dot`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-landing-green ${
                  index === activeIndex ? 'w-7 bg-landing-green' : 'w-2 bg-white/25 hover:bg-white/40'
                }`}
                aria-label={`Show IPM Playbook slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
