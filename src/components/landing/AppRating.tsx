import { Star, ArrowUpRight } from "lucide-react";
import { appStoreUrl } from "./ctaLinks";
export default function AppRating({ compact = false }: { compact?: boolean }) {
  return <a className={`app-rating${compact ? " compact" : ""}`} href={appStoreUrl("rating-proof")} data-cta-location="rating-proof:ios" aria-label="Rated 5 out of 5 on the App Store. Read App Store reviews.">
    <span className="rating-stars" aria-hidden="true">{Array.from({length:5},(_,i)=><Star key={i} size={compact ? 16 : 24} fill="currentColor" />)}</span>
    <strong>5.0 on the App Store</strong><ArrowUpRight size={17} aria-hidden="true" />
  </a>;
}
