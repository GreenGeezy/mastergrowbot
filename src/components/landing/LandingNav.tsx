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
        <a
          href={AMAZON_BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cta-location="nav:amazon-book"
          className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans"
        >
          IPM Playbook
        </a>
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
        <Link
          to="/grow-tech"
          data-cta-location="nav:growtech-shop"
          className="group inline-flex items-center gap-2 rounded-lg border border-amber-300/50 bg-gradient-to-r from-amber-300/14 via-landing-green/10 to-landing-green/5 px-3 py-1.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(251,191,36,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300/80 hover:text-amber-100 hover:shadow-[0_0_28px_rgba(251,191,36,0.22)] focus:outline-none focus:ring-2 focus:ring-amber-300/70 focus:ring-offset-2 focus:ring-offset-black font-sans"
        >
          <span>GrowTech Shop</span>
          <span className="rounded-full border border-amber-300/55 bg-amber-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-black shadow-[0_0_14px_rgba(251,191,36,0.35)] transition-transform duration-200 group-hover:scale-105">
            New Products
          </span>
        </Link>
      </div>
    </nav>
  );
}
