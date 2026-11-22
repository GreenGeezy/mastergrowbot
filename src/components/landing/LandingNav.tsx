import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';

type NavLink = { label: string; to: string };

const navLinksBefore: NavLink[] = [
  { label: 'App', to: '/' },
  { label: 'Shop', to: '/grow-tech' },
];

// One "Free Tools" menu item holds every tool, so new tools never add a top-level item.
// Each tool keeps its own descriptive link text on every page.
export const freeTools: (NavLink & { blurb: string })[] = [
  { label: 'Home Grow Fieldnotes', to: '/home-grow-journal?utm_source=free_tools&utm_medium=website&utm_campaign=home_fieldnotes', blurb: 'Compare plant photos with ChatGPT or Claude' },
  { label: 'VPD Calculator', to: '/vpd-calculator', blurb: 'Leaf VPD and chart by growth stage' },
  { label: 'Grow Light Calculator', to: '/grow-light-calculator', blurb: 'DLI, PPFD and light hours' },
  { label: 'Symptom Checker', to: '/cannabis-symptom-checker', blurb: 'Yellow leaves, spots, curling, drooping' },
];

const navLinksAfter: NavLink[] = [
  { label: 'Guides', to: '/grow-guides' },
  { label: 'Newsletter', to: '/newsletter?utm_source=site_nav&utm_medium=website&utm_campaign=weekly_workbench' },
];

const desktopLinkClass = 'group inline-flex items-center gap-1.5 text-sm font-medium text-white/62 transition hover:text-white';
const mobileLinkClass = 'flex items-center justify-between border-b border-white/[0.08] py-5 text-2xl font-semibold tracking-tight text-white';

export default function LandingNav({ growTechMode = false, onMenuOpenChange }: { growTechMode?: boolean; onMenuOpenChange?: (open: boolean) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const changeMenu = (open: boolean) => { setMenuOpen(open); onMenuOpenChange?.(open); };
  const navAppStoreUrl = '/#download';
  const mobileNavAppStoreUrl = '/#download';

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-black/72 px-4 backdrop-blur-2xl sm:px-6">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="MasterGrowbot AI home">
          <img src="/images/app-icon.png" alt="" className="h-9 w-9 rounded-xl shadow-[0_0_24px_rgba(126,34,206,0.32)]" width={36} height={36} />
          <span className="text-sm font-bold tracking-[-0.01em] text-white font-sans sm:text-base">MasterGrowbot <span className="text-landing-green">AI</span></span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {navLinksBefore.map((link) => (
            <Link key={link.to} to={link.to} className={desktopLinkClass}>{link.label}</Link>
          ))}

          <div className="group/tools relative">
            <button type="button" className={`${desktopLinkClass} cursor-default`} aria-haspopup="true">
              Free Tools <ChevronDown className="h-3.5 w-3.5 transition group-hover/tools:rotate-180 group-focus-within/tools:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition group-hover/tools:visible group-hover/tools:opacity-100 group-focus-within/tools:visible group-focus-within/tools:opacity-100">
              <div className="rounded-2xl border border-white/10 bg-[#050806] p-2 shadow-2xl">
                {freeTools.map((tool) => (
                  <Link key={tool.to} to={tool.to} className="block rounded-xl px-3 py-2.5 transition hover:bg-white/[0.06]">
                    <span className="block text-sm font-semibold text-white">{tool.label}</span>
                    <span className="block text-xs text-white/50">{tool.blurb}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinksAfter.map((link) => (
            <Link key={link.to} to={link.to} className={desktopLinkClass}>{link.label}</Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {growTechMode ? (
            <a href="/grow-tech#grow-light" className="group inline-flex items-center gap-2 rounded-full bg-landing-green px-5 py-2.5 text-sm font-black text-black hover:bg-landing-green-glow">
              Explore the light <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <>
              <Link to="/grow-tech" className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white/76 transition hover:border-landing-green/35 hover:text-landing-green">Shop GrowTech</Link>
              <a href={navAppStoreUrl} data-cta-location="navigation:stores" className="group inline-flex items-center gap-2 rounded-full bg-landing-green px-5 py-2.5 text-sm font-black text-black shadow-[0_0_28px_rgba(29,185,84,0.24)] transition hover:-translate-y-0.5 hover:bg-landing-green-glow">
                Get the App <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            </>
          )}
        </div>

        <button type="button" onClick={() => changeMenu(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white lg:hidden" aria-label="Open navigation menu" aria-expanded={menuOpen}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[100] min-h-svh overflow-y-auto bg-[#010302]/98 px-5 py-5 backdrop-blur-2xl lg:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">MasterGrowbot <span className="text-landing-green">AI</span></span>
            <button type="button" onClick={() => changeMenu(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white" aria-label="Close navigation menu"><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-10 flex flex-col">
            {navLinksBefore.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => changeMenu(false)} className={mobileLinkClass}>
                {link.label}<ArrowRight className="h-5 w-5 text-landing-green" />
              </Link>
            ))}
            <div className="border-b border-white/[0.08] py-5">
              <p className="text-2xl font-semibold tracking-tight text-white">Free Tools</p>
              <div className="mt-3 flex flex-col gap-1">
                {freeTools.map((tool) => (
                  <Link key={tool.to} to={tool.to} onClick={() => changeMenu(false)} className="flex items-center justify-between rounded-xl py-2.5 text-lg font-medium text-white/80">
                    {tool.label}<ArrowRight className="h-4 w-4 text-landing-green" />
                  </Link>
                ))}
              </div>
            </div>
            {navLinksAfter.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => changeMenu(false)} className={mobileLinkClass}>
                {link.label}<ArrowRight className="h-5 w-5 text-landing-green" />
              </Link>
            ))}
          </div>
          {growTechMode ? (
            <Link to="/grow-tech#grow-light" onClick={() => changeMenu(false)} className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-landing-green px-6 py-4 text-base font-black text-black">Explore the light <ArrowRight className="h-4 w-4" /></Link>
          ) : (
            <a href={mobileNavAppStoreUrl} onClick={() => changeMenu(false)} data-cta-location="mobile-navigation:stores" className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-landing-green px-6 py-4 text-base font-black text-black">Choose your app store <ArrowRight className="h-4 w-4" /></a>
          )}
        </div>
      ) : null}
    </nav>
  );
}
