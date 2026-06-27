import { Link } from 'react-router-dom';
import { AmazonBookButton } from './AmazonBookButton';
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
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-5">
        <GrowTechCTA variant="nav" ctaLocation="nav:growtech-shop" />
        <Link
          to="/grow-guides"
          className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans sm:pt-[11px]"
        >
          Grow Guides
        </Link>
        <Link
          to="/vpd-calculator"
          className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans sm:pt-[11px]"
        >
          VPD Calculator
        </Link>
        <Link
          to="/contact"
          className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans sm:pt-[11px]"
        >
          Contact
        </Link>
        <div className="flex flex-col items-center gap-1.5 leading-none">
          <a
            href={AMAZON_BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta-location="nav:amazon-book-text"
            className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans sm:pt-[11px]"
          >
            IPM Playbook
          </a>
          <AmazonBookButton
            location="nav"
            imageClassName="h-[54px] max-w-[168px] rounded-lg sm:h-[60px]"
          />
        </div>
      </div>
    </nav>
  );
}
