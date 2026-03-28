import { Link } from 'react-router-dom';

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
      <Link
        to="/grow-guides"
        className="text-sm font-medium text-white/60 hover:text-landing-green transition-colors duration-200 font-sans"
      >
        Grow Guides
      </Link>
    </nav>
  );
}
