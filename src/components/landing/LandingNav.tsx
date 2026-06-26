import { Link } from 'react-router-dom';
import { AmazonBookButton } from './AmazonBookButton';
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
        <div className="flex flex-col items-center gap-1.5 leading-none">
          <a
            href="/#ipm-playbook"
            data-cta-location="nav:ipm-playbook-section"
            className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans"
          >
            IPM Playbook
          </a>
          <AmazonBookButton
            location="nav"
            imageClassName="h-[24px] max-w-[88px] rounded-md sm:h-[26px]"
          />
        </div>
      </div>
    </nav>
  );
}
