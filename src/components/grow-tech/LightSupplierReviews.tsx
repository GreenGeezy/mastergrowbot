import { Star } from 'lucide-react';
const source = 'https://www.temu.com/--100w-led-grow-light-for-beginners-new--layout--growing-lamps-for-indoor-plants-hydroponic-seed-starting-vegetables-bloom-in-grow-tent-g-601101493334995.html';
const reviews = [
  {name:'John Mcrobie', date:'January 7, 2026', quote:'love this little light this is my second light', context:'The supplier marks this reviewer as a repeat purchaser.'},
  {name:'Jamwa', date:'September 4, 2025', quote:'The grow light works great', context:'Feedback on the AG1000 supplier listing.'},
  {name:'Luis Montoya', date:'September 19, 2025', quote:'I really like the quality.', context:'The reviewer liked it for seed starting and cautioned against expecting it to handle a full expert grow cycle.'},
];
export default function LightSupplierReviews() {
  return <section className="gt-container gt-section" aria-labelledby="light-reviews-title">
    <p className="gt-kicker">FEEDBACK ON THE AG1000</p><h2 id="light-reviews-title">What supplier customers say.</h2>
    <p className="gt-small">Three five-star excerpts from the exact ALPHAGROW AG1000 Temu listing, checked October 20, 2026. These are supplier reviews, not reviews of purchases from MasterGrowbot. Selected positive reviews do not represent every buyer’s experience.</p>
    <div className="gt-support-grid">{reviews.map(review=><figure key={review.name} className="rounded-xl border border-white/15 p-6"><div aria-label="5 out of 5 stars" className="mb-4 flex gap-1 text-amber-200">{[0,1,2,3,4].map(star=><Star key={star} size={15} fill="currentColor" aria-hidden="true"/>)}</div><blockquote className="text-lg leading-7">“{review.quote}”</blockquote><figcaption className="mt-4 text-sm"><strong>{review.name}</strong> · {review.date}<p className="mt-3 text-xs leading-5 text-white/65">{review.context}</p><a href={source} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs underline">Source: Temu AG1000 listing</a></figcaption></figure>)}</div>
  </section>;
}
