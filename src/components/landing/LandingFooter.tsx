import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="relative z-10 py-10 px-4 sm:px-6 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30 font-sans">
        <p>© {new Date().getFullYear()} AGCOM SOLUTIONS LLC. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/grow-guides" className="hover:text-white/60 transition-colors">
            Grow Guides
          </Link>
          <Link to="/privacy-policy" className="hover:text-white/60 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-white/60 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
