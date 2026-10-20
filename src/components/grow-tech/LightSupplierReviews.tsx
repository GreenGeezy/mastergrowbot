import { Star } from 'lucide-react';
const reviews = [
  {name:'John Mcrobie', date:'January 7, 2026', quote:'love this little light this is my second light'},
  {name:'Jamwa', date:'September 4, 2025', quote:'The grow light works great'},
  {name:'Luis Montoya', date:'September 19, 2025', quote:'I really like the quality.'},
];
export default function LightSupplierReviews() {
  return <section className="gt-container gt-section gt-light-reviews" aria-labelledby="light-reviews-title">
    <p className="gt-kicker">FEEDBACK ON THE AG1000</p><h2 id="light-reviews-title">AG1000 product reviews.</h2>
    <p className="gt-small">Independent product reviews</p>
    <div className="gt-support-grid">{reviews.map(review=><figure key={review.name} className="rounded-xl border border-white/15 p-6"><div aria-label="5 out of 5 stars" className="mb-4 flex gap-1 text-amber-200">{[0,1,2,3,4].map(star=><Star key={star} size={15} fill="currentColor" aria-hidden="true"/>)}</div><blockquote className="text-lg leading-7">“{review.quote}”</blockquote><figcaption className="mt-4 text-sm"><strong>{review.name}</strong> · {review.date}</figcaption></figure>)}</div>
  </section>;
}
