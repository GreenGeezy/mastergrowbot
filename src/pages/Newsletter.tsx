import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { ArrowRight } from 'lucide-react';
import NewsletterSignup from '@/components/landing/NewsletterSignup';
import { appStoreUrl } from '@/components/landing/ctaLinks';
import { rememberReferral, withReferral } from '@/lib/referral';
import './growWeek/grow-week.css';
import './newsletter-page.css';

// Only customer-delivered issues belong in this directory. Dated filenames sort newest first.
const published = import.meta.glob<string>('../data/newsletter/published/*.md', { eager: true, query: '?raw', import: 'default' });
const url = 'https://www.mastergrowbot.com/newsletter';

export default function Newsletter() {
  const [links, setLinks] = useState({
    home: '/cannabis-grow-calendar?utm_source=newsletter_page&utm_medium=website&utm_campaign=grow_week',
    business: '/downloads/cannabis-ai-at-work.html?utm_source=newsletter_page&utm_medium=website&utm_campaign=workbench',
  });
  useEffect(() => {
    rememberReferral();
    setLinks({
      home: withReferral('/cannabis-grow-calendar', { utm_source: 'newsletter_page', utm_medium: 'website', utm_campaign: 'grow_week' }),
      business: withReferral('/downloads/cannabis-ai-at-work.html', { utm_source: 'newsletter_page', utm_medium: 'website', utm_campaign: 'workbench' }),
    });
  }, []);
  const issues = Object.keys(published).sort().reverse();

  return (
    <main className="nlp">
      <Helmet>
        <title>Cannabis AI Newsletter | MasterGrowbot AI</title>
        <meta name="description" content="Free weekly cannabis AI newsletter from the makers of the MasterGrowbot AI app: one reported story, dated sources and an AI technique to try. Subscribe." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Cannabis AI News & Tools: one useful email a week" />
        <meta property="og:description" content="One reported story where cannabis meets technology, the AI news worth your time, and one technique to try." />
        <meta property="og:image" content="https://www.mastergrowbot.com/downloads/home-grow-cover.webp" />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MasterGrowbot AI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cannabis AI News & Tools" />
        <meta name="twitter:description" content="One useful email a week on cannabis and AI. Free." />
        <meta name="twitter:image" content="https://www.mastergrowbot.com/downloads/home-grow-cover.webp" />
      </Helmet>

      <header className="gw-mast"><div className="gw-wrap">
        <a href="/" className="gw-brand">MasterGrowbot <b>AI</b></a>
        <a href="https://www.linkedin.com/company/cannabis-ai-news-and-tools/" className="gw-link">Follow on LinkedIn</a>
      </div></header>

      <section className="nlp-hero"><div className="gw-wrap nlp-hero-grid">
        <div>
          <p className="gw-eyebrow">Weekly · Free · From the team behind MasterGrowbot AI</p>
          <h1>Cannabis AI <em>News &amp; Tools</em></h1>
          <p className="gw-lede">Where cannabis and AI meet, in one email a week. A reported story with a point of view, the developments worth your attention, and one technique you can try at home or at work.</p>
        </div>
        <div className="nlp-form">
          <NewsletterSignup placement="newsletter_page" heading="Get the next edition" headingLevel="h2" campaign="weekly_edition" />
        </div>
      </div></section>

      <section className="gw-wrap nlp-anatomy" aria-labelledby="anatomy-title">
        <h2 id="anatomy-title" className="gw-h2">What’s in each edition</h2>
        <ol>
          <li><span>01</span><h3>The story</h3><p>200 to 350 words on one development, decision or documented test, with what changed and what is still uncertain. Every fact links to a dated source.</p></li>
          <li><span>02</span><h3>The signal</h3><p>Two or three dated developments from cannabis technology and mainstream AI, each with one line on why it matters to a grower or a cannabis business.</p></li>
          <li><span>03</span><h3>AI Advantage <small>AI Tips &amp; Tricks</small></h3><p>One thing to try this week, the output you should expect, and a quick way to check the answer before you trust it.</p></li>
        </ol>
        <p className="gw-muted">Our rules: no invented tests, quotes or reader stories. No sponsored placements dressed as news. When we mention something we sell, we say so.</p>
      </section>

      <section className="nlp-tools" aria-labelledby="tools-title"><div className="gw-wrap">
        <h2 id="tools-title" className="gw-h2">Start with a free tool</h2>
        <div className="nlp-tool-grid">
          <a className="nlp-tool" href={links.home}>
            <p className="gw-eyebrow">For your home grow</p>
            <h3>Grow Week</h3>
            <p>Enter your sprout date. See what week you’re in, what’s normal now, when to check trichomes, and get an AI check-in that knows your plant.</p>
            <span>Open the grow calendar <ArrowRight size={16} aria-hidden="true" /></span>
          </a>
          <a className="nlp-tool" href={links.business}>
            <p className="gw-eyebrow">For your cannabis business</p>
            <h3>Cannabis AI Workbench</h3>
            <p>Review a sensor log, model a stock shortfall, or compare two procedures, with editable examples and a printable result.</p>
            <span>Open the Workbench <ArrowRight size={16} aria-hidden="true" /></span>
          </a>
        </div>
      </div></section>

      <section className="gw-wrap nlp-archive" aria-labelledby="archive-title">
        <h2 id="archive-title" className="gw-h2">Past editions</h2>
        {issues.length ? issues.map(path => (
          <article key={path} id={path.split('/').pop()?.replace(/\.md$/, '')} className="nlp-issue">
            <ReactMarkdown components={{ h1: 'h3', h2: 'h4', h3: 'h4' }}>{published[path]}</ReactMarkdown>
          </article>
        )) : <p className="gw-muted">Editions appear here after they reach subscribers. Subscribe above to get the first one in your inbox.</p>}
      </section>

      <footer className="gw-foot"><div className="gw-wrap">
        <a href="/">MasterGrowbot AI home</a><a href="/grow-guides">Grow guides</a>
        <a href={appStoreUrl('newsletter')} data-cta-location="newsletter:ios">MasterGrowbot AI on the App Store</a>
        <a href="https://www.linkedin.com/company/cannabis-ai-news-and-tools/">LinkedIn</a><a href="/privacy-policy">Privacy</a>
      </div></footer>
    </main>
  );
}
