import { Link } from 'react-router-dom';
import { AMAZON_BOOK_URL } from './ctaLinks';

export default function LandingNav() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.04]">
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
      <div className="flex items-center gap-5">
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
          Book
        </a>
      </div>
    </nav>
  );
}
