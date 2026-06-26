import { Link } from 'react-router-dom';
import { AMAZON_BOOK_URL } from './ctaLinks';
import GrowTechCTA from './GrowTechCTA';

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
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-5">
        <GrowTechCTA variant="nav" ctaLocation="nav:growtech-shop" />
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
        <div className="flex flex-col items-center gap-1 leading-none">
          <a
            href="/#ipm-playbook"
            data-cta-location="nav:ipm-playbook-section"
            className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans"
          >
            IPM Playbook
          </a>
          <a
            href={AMAZON_BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Available on Amazon, opens in new tab"
            data-cta-location="nav:amazon-book"
            className="rounded-md border border-landing-green/25 px-2.5 py-1 text-[11px] font-semibold text-landing-green transition-colors duration-200 hover:border-landing-green/55 hover:text-landing-green/85 font-sans"
          >
            Available on Amazon
          </a>
        </div>
      </div>
    </nav>
  );
}
