import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { growTechOfferUrl } from "@/lib/growTechAttribution";

export default function LensOfferLink({ location }: { location: string }) {
  return <aside className="my-8 rounded-2xl border border-emerald-400/25 bg-emerald-950/40 p-5">
    <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Put the photo workflow into practice</p>
    <h2 className="mt-2 text-xl font-bold text-white">A closer look, with a place to keep your notes.</h2>
    <p className="mt-2 text-sm leading-6 text-white/70">Explore the APEXEL 10–20X lens with LED light, plus MasterGrowbot’s equipment guide, worksheets and observation log. $119 one time. Check phone compatibility and ordering availability before buying.</p>
    <Link to={growTechOfferUrl(location)} className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-emerald-300" onClick={() => trackEvent("growtech_content_offer_click", { placement: location, cta_location: location, source_page: typeof window === "undefined" ? undefined : window.location.pathname })}>See the lens + guide <ArrowRight size={18}/></Link>
  </aside>;
}
