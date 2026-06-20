import { Link } from 'react-router-dom';
import { AMAZON_BOOK_URL } from './ctaLinks';

export default function LandingNav() {
  return (
    <nav className="relative z-20 flex flex-col items-center justify-between gap-4 px-4 py-4 border-b border-white/[0.04] sm:flex-row sm:px-6">
      <Link to="/" className="flex items-center gap-2.5">
        <img
          src="/images/app-icon.png"
          alt="MasterGrowbot AI logo"
          className="w-8 h-8 rounded-lg"
          width={32}
          height={32}
        />
        <span className="text-sm font-semibold text-white/90 font-sans tracking-wide">
          MasterGrowbot AI
        </span>
      </Link>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        <Link
          to="/grow-tech"
          className="group flex items-center gap-2 text-sm font-medium text-white/60 transition-colors duration-200 hover:text-landing-green font-sans"
        >
          <span>Grow Tech</span>
          <span className="rounded-full border border-landing-green/30 bg-landing-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-landing-green shadow-[0_0_16px_rgba(29,185,84,0.18)]">
            Coming Soon
          </span>
        </Link>
        <Link
          to="/grow-guides"
          className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans"
        >
          Grow Guides
        </Link>
        <Link
          to="/vpd-calculator"
          className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans"
        >
          VPD Calculator
        </Link>
        <Link
          to="/contact"
          className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans"
        >
          Contact
        </Link>
        <a
          href={AMAZON_BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cta-location="nav:amazon-book"
          className="text-sm font-semibold text-landing-green hover:text-landing-green/80 transition-colors duration-200 font-sans border border-landing-green/30 hover:border-landing-green/60 px-3 py-1 rounded-lg"
        >
          IPM Playbook
        </a>
      </div>
    </nav>
  );
}
