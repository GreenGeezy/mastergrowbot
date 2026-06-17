import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronRight, BookOpen } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { AppPlatformButtons, RatingStars } from '@/components/landing/cta';
import { AMAZON_BOOK_URL, appStoreUrl as buildAppStoreUrl, playStoreUrl as buildPlayStoreUrl } from '@/components/landing/ctaLinks';
import { growGuides, getGuideBySlug } from '@/data/growGuides';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function GrowGuideArticle() {
  const { slug } = useParams<{ slug: string }>();
  const guide = getGuideBySlug(slug ?? '');

  if (!guide) {
    return <Navigate to="/grow-guides" replace />;
  }

  const appStoreUrl = buildAppStoreUrl(guide.slug);
  const playStoreUrl = buildPlayStoreUrl(guide.slug);
  const canonicalUrl = `https://www.mastergrowbot.com/grow-guides/${guide.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.metaDescription,
    image: 'https://www.mastergrowbot.com/lovable-uploads/cdeebe66-3489-4cb2-a2e7-0a4763d845ce.png',
    author: { '@type': 'Organization', name: 'MasterGrowbot AI', url: 'https://www.mastergrowbot.com' },
    publisher: {
      '@type': 'Organization',
      name: 'MasterGrowbot AI',
      logo: { '@type': 'ImageObject', url: 'https://www.mastergrowbot.com/logo.png' },
    },
    datePublished: guide.publishedDate,
    dateModified: guide.modifiedDate,
    mainEntityOfPage: canonicalUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mastergrowbot.com/' },
      { '@type': 'ListItem', position: 2, name: 'Grow Guides', item: 'https://www.mastergrowbot.com/grow-guides' },
      { '@type': 'ListItem', position: 3, name: guide.title },
    ],
  };


  const relatedGuides = growGuides.filter(
    (g) => g.slug !== guide.slug && (guide.relatedSlugs.includes(g.slug) || guide.relatedSlugs.length === 0)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEOHead
        title={guide.metaTitle}
        description={guide.metaDescription}
        canonicalUrl={canonicalUrl}
        pageType="article"
        publishedDate={guide.publishedDate}
        modifiedDate={guide.modifiedDate}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <LandingNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/40 font-sans mb-8 flex-wrap">
          <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link to="/grow-guides" className="hover:text-white/70 transition-colors">Grow Guides</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-white/60 truncate max-w-[200px] sm:max-w-none">{guide.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          {/* Main Content */}
          <article>
            {/* Article Header */}
            <motion.header
              className="mb-10 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-landing-green font-semibold tracking-wider uppercase text-sm font-sans">
                Cannabis Grow Guide
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
                {guide.h1}
              </h1>
              <p className="text-sm text-white/40 font-sans">
                Published {new Date(guide.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {guide.modifiedDate !== guide.publishedDate && (
                  <> · Updated {new Date(guide.modifiedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</>
                )}
              </p>
            </motion.header>

            {/* Table of Contents */}
            <motion.nav
              aria-label="Table of contents"
              className="mb-10 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans mb-3">In this guide</p>
              <ol className="space-y-1.5">
                {guide.sections.map((section) => (
                  <li key={section.heading}>
                    <a
                      href={`#${slugify(section.heading)}`}
                      className="text-sm text-white/60 hover:text-landing-green transition-colors duration-150 font-sans flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-landing-green transition-colors flex-shrink-0" />
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </motion.nav>

            {/* Intro */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {guide.intro.split('\n\n').map((para, i) => (
                <p key={i} className="text-base sm:text-lg text-white/70 leading-relaxed font-sans mb-4">
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Inline CTA (within first 300 words) */}
            <div className="mb-10 rounded-2xl border border-landing-green/20 bg-landing-green/5 p-6 flex flex-col gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-landing-green font-sans mb-1">Skip the guesswork</p>
                <p className="text-sm text-white/60 font-sans">
                  Snap a photo of your plant and MasterGrowbot AI diagnoses the exact issue in seconds.
                </p>
              </div>
              <AppPlatformButtons campaign={guide.slug} location="article-inline" className="sm:justify-start" />
            </div>

            {/* Article Sections */}
            {guide.sections.map((section, i) => (
              <motion.section
                key={section.heading}
                id={slugify(section.heading)}
                className="mb-12 scroll-mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-4 leading-snug">
                  {section.heading}
                </h2>
                {section.bodyHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
                    className="text-base text-white/65 leading-relaxed font-sans overflow-x-auto"
                  />
                ) : (
                  (section.body ?? '').split('\n\n').map((para, j) => (
                    <p key={j} className="text-base text-white/65 leading-relaxed font-sans mb-3">
                      {para}
                    </p>
                  ))
                )}
              </motion.section>
            ))}


            {/* Closing CTA */}
            <div className="mb-12 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-white/65 font-sans">
                <RatingStars iconClassName="w-3.5 h-3.5" />
                <span>Rated 5 Stars by Growers Just Like You</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-landing-green font-sans">
                Download MasterGrowbot AI: Free 3-Day Trial
              </h2>
              <p className="text-white/60 font-sans text-sm sm:text-base max-w-lg mx-auto">
                Snap a photo. Save your plant. Try MasterGrowbot AI free: AI plant diagnosis, grow journal, strain database, and daily tasks in one app.
              </p>
              <AppPlatformButtons campaign={guide.slug} location="article-closing" className="pt-2" />
              <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-landing-green/20 bg-black/40 p-5">
                <h3 className="text-lg font-bold text-white font-sans">Save Your Grow from Pests & Diseases</h3>
                <p className="mt-2 text-sm text-white/60 font-sans">
                  Use The Master Cannabis IPM Playbook as your weekly pest and disease prevention system.
                </p>
                <a
                  href={AMAZON_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-location="article-closing:amazon-book"
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-landing-green/40 px-5 py-3 text-sm font-semibold text-landing-green transition-colors hover:border-landing-green/70 hover:bg-landing-green/10 font-sans"
                >
                  Available on Amazon
                </a>
              </div>
            </div>

            {/* Internal links */}
            <div className="mb-12 text-sm text-white/40 font-sans space-x-4">
              <Link to="/grow-guides" className="hover:text-landing-green transition-colors">
                ← All Grow Guides
              </Link>
              <Link to="/" className="hover:text-landing-green transition-colors">
                MasterGrowbot AI Home
              </Link>
            </div>
          </article>

          {/* Sticky Sidebar — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-5">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                  AI Plant Diagnosis
                </p>
                <p className="text-sm font-semibold text-white font-sans leading-snug">
                  Download MasterGrowbot AI
                </p>
                <div className="flex items-center gap-1 text-[11px] text-white/50 font-sans">
                  <RatingStars iconClassName="w-3 h-3" />
                  <span>Rated 5 Stars by Growers Just Like You</span>
                </div>
                <p className="text-xs text-white/50 font-sans leading-relaxed">
                  Your AI master grower, in your pocket. Snap a photo and get an instant diagnosis and treatment plan.
                </p>
                <a
                  href={appStoreUrl}
                  data-cta-location="article-sidebar:ios"
                  className="flex items-center justify-center gap-2 w-full bg-landing-green text-black font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-landing-green/90 transition-colors font-sans"
                >
                  Get instant AI plant diagnosis on iOS
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={playStoreUrl}
                  data-cta-location="article-sidebar:android"
                  className="flex items-center justify-center gap-2 w-full border border-white/10 text-white/70 font-medium text-sm px-4 py-2.5 rounded-xl hover:border-landing-green/40 hover:text-white transition-colors font-sans"
                >
                  Get instant AI plant diagnosis on Android
                </a>
              </div>

              <div className="rounded-2xl border border-landing-green/20 bg-landing-green/5 p-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-landing-green font-sans">
                  IPM Playbook
                </p>
                <p className="text-sm font-semibold text-white font-sans leading-snug">
                  Save Your Grow from Pests & Diseases
                </p>
                <p className="text-xs text-white/50 font-sans leading-relaxed">
                  Use The Master Cannabis IPM Playbook as your weekly pest and disease prevention system.
                </p>
                <a
                  href={AMAZON_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-location="article-sidebar:amazon-book"
                  className="flex items-center justify-center gap-2 w-full border border-landing-green/40 text-landing-green font-semibold text-sm px-4 py-2.5 rounded-xl hover:border-landing-green/70 hover:bg-landing-green/10 transition-colors font-sans"
                >
                  Available on Amazon
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Related guides in sidebar */}
              {relatedGuides.length > 0 && (
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                    Related Guides
                  </p>
                  {relatedGuides.map((related) => (
                    <Link
                      key={related.slug}
                      to={`/grow-guides/${related.slug}`}
                      className="group flex items-start gap-2.5 text-sm text-white/60 hover:text-landing-green transition-colors font-sans"
                    >
                      <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-white/30 group-hover:text-landing-green transition-colors" />
                      {related.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Related Guides — full width below article on all screens */}
        {relatedGuides.length > 0 && (
          <section className="mt-4 pt-12 border-t border-white/[0.06]">
            <h2 className="text-xl font-bold text-white font-sans mb-6">Related Grow Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedGuides.map((related, i) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <Link
                    to={`/grow-guides/${related.slug}`}
                    className="group block rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:border-landing-green/30 transition-all duration-300 p-5 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-landing-green" />
                      <h3 className="text-sm font-semibold text-white group-hover:text-landing-green transition-colors font-sans">
                        {related.title}
                      </h3>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed font-sans">{related.shortDescription}</p>
                    <div className="flex items-center gap-1 text-landing-green text-xs font-medium font-sans">
                      Read guide <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      <LandingFooter />
    </div>
  );
}
