const source = "https://www.shopapexel.com/products/zoommacro-macro-lens";
// Short, attributed excerpts checked against APEXEL's product page on 2026-10-06.
const reviews = [
  { name: "Bonnie O.", quote: "Really elevates the quality of my closeup photos" },
  { name: "Stacie H.", quote: "The clip is very sturdy" },
  { name: "Johannes W.", quote: "Great lens with great usability", note: "Also noted that attaching the lens took effort." },
];

export default function LensTestimonials() {
  return (
    <section className="lens-wrap lens-section" id="lens-reviews" aria-labelledby="lens-reviews-heading" data-section="growtech-testimonials">
      <p className="lens-eyebrow">FEEDBACK FROM LENS BUYERS</p>
      <h2 id="lens-reviews-heading">A closer look, in their words.</h2>
      <p className="lens-lede">Selected excerpts from APEXEL’s ZoomMacro product reviews. These describe the lens, not purchases of the MasterGrowbot package.</p>
      <div className="lens-grid lens-reviews">
        {reviews.map((review) => (
          <article key={review.name}>
            <blockquote>“{review.quote}”</blockquote>
            <p className="lens-review-author">{review.name}</p>
            {review.note && <p className="lens-small">{review.note}</p>}
            <a className="lens-secondary" href={source} target="_blank" rel="noopener noreferrer">APEXEL product review ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}
