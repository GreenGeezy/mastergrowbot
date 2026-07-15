import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { appStoreUrl } from './ctaLinks';

const navLinks = [
  { label: 'GrowTech', to: '/grow-tech' },
  { label: 'Grow Guides', to: '/grow-guides' },
  { label: 'AI Strategy', to: '/ai-strategy', badge: 'NEW' },
  { label: 'VPD Calculator', to: '/vpd-calculator' },
  { label: 'Contact', to: '/contact' },
];

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-black/72 px-4 backdrop-blur-2xl sm:px-6">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="MasterGrowbot AI home">
          <img src="/images/app-icon.png" alt="" className="h-9 w-9 rounded-xl shadow-[0_0_24px_rgba(126,34,206,0.32)]" width={36} height={36} />
          <span className="text-sm font-bold tracking-[-0.01em] text-white font-sans sm:text-base">MasterGrowbot <span className="text-landing-green">AI</span></span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/62 transition hover:text-white">
              {link.label}
              {link.badge ? <span className="rounded-full bg-gold px-1.5 py-0.5 text-[8px] font-black text-black">{link.badge}</span> : null}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link to="/grow-tech" className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white/76 transition hover:border-landing-green/35 hover:text-landing-green">Shop GrowTech</Link>
          <a href={appStoreUrl('nav')} className="group inline-flex items-center gap-2 rounded-full bg-landing-green px-5 py-2.5 text-sm font-black text-black shadow-[0_0_28px_rgba(29,185,84,0.24)] transition hover:-translate-y-0.5 hover:bg-landing-green-glow">
            Try Free <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <button type="button" onClick={() => setMenuOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white sm:hidden" aria-label="Open navigation menu" aria-expanded={menuOpen}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[100] min-h-svh bg-[#010302]/98 px-5 py-5 backdrop-blur-2xl sm:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">MasterGrowbot <span className="text-landing-green">AI</span></span>
            <button type="button" onClick={() => setMenuOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white" aria-label="Close navigation menu"><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-12 flex flex-col">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-white/[0.08] py-5 text-2xl font-semibold tracking-tight text-white">
                {link.label}<ArrowRight className="h-5 w-5 text-landing-green" />
              </Link>
            ))}
          </div>
          <a href={appStoreUrl('mobile-nav')} className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-landing-green px-6 py-4 text-base font-black text-black">Start 3-Day Free Trial <ArrowRight className="h-4 w-4" /></a>
        </div>
      ) : null}
    </nav>
  );
}
