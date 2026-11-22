import NewsletterSignup from './NewsletterSignup';

// The homepage's only newsletter placement. It sits after every app, product and
// playbook section, immediately before the footer, so it never interrupts the sale.
export default function NewsletterBand() {
  return (
    <section id="weekly-newsletter" aria-labelledby="newsletter-band-title" className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.1fr_1fr] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">From the MasterGrowbot team</p>
          <h2 id="newsletter-band-title" className="mt-2 font-serif text-2xl font-normal text-white sm:text-3xl">Cannabis AI News &amp; Tools</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            A free weekly email: one reported story where cannabis meets technology, and one AI technique worth trying.
            Growing at home? <a className="text-white/80 underline underline-offset-4 hover:text-landing-green" href="/cannabis-grow-calendar?utm_source=homepage&utm_medium=website&utm_campaign=grow_week&utm_content=footer_band">Plan your grow week by week</a>.
          </p>
        </div>
        <NewsletterSignup placement="newsletter_homepage_footer" tone="night" campaign="weekly_edition" button="Subscribe" />
      </div>
    </section>
  );
}
