import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import GrowTechCTA from '@/components/landing/GrowTechCTA';
import { AppPlatformButtons } from '@/components/landing/cta';
import { Input } from '@/components/ui/input';
import { growGuides } from '@/data/growGuides';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mastergrowbot.com/' },
    { '@type': 'ListItem', position: 2, name: 'Grow Guides', item: 'https://www.mastergrowbot.com/grow-guides' },
  ],
};


export default function GrowGuidesHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredGuides = useMemo(() => {
    if (!normalizedQuery) {
      return growGuides;
    }

    return growGuides.filter((guide) => {
      const searchableText = [
        guide.title,
        guide.h1,
        guide.shortDescription,
        guide.metaTitle,
        guide.metaDescription,
        guide.intro,
        guide.slug.replace(/-/g, ' '),
        ...guide.sections.flatMap((section) => [section.heading, section.body ?? '', section.bodyHtml ?? '']),
        ...guide.faqs.flatMap((faq) => [faq.question, faq.answer]),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEOHead
        title="Cannabis Grow Guides | MasterGrowbot AI"
        description="Free expert cannabis grow guides covering nutrients, pests, harvest timing, and more. Powered by MasterGrowbot AI's plant diagnosis technology."
        canonicalUrl="https://www.mastergrowbot.com/grow-guides"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <LandingNav />

      {/* Hero */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-white/40 font-sans mb-2">
            <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">Grow Guides</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-landing-green font-semibold tracking-wider uppercase text-sm mb-4">
              Expert Cannabis Cultivation
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
              Cannabis Grow Guides:{' '}
              <span className="text-landing-green">Expert Tips Powered by AI</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-sans">
              Free, in-depth guides on everything from nutrient deficiencies to harvest timing. Each guide is built around MasterGrowbot AI's plant diagnosis data so you get advice that's actually grounded in what real plants do.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col items-center justify-center gap-3 pt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <AppPlatformButtons campaign="grow-guides" location="grow-guides-hero" />
            <div className="flex flex-col items-center gap-2 pt-1">
              <GrowTechCTA variant="compact" showSubtext ctaLocation="grow-guides:growtech" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* VPD Calculator Banner */}
      <section className="relative z-10 px-4 sm:px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/vpd-calculator"
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-landing-green/25 bg-landing-green/5 hover:bg-landing-green/10 hover:border-landing-green/40 transition-all duration-300 px-6 py-5"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-landing-green font-sans">
                Free Tool
              </p>
              <p className="text-base font-semibold text-white font-sans leading-snug">
                Free VPD Calculator
              </p>
              <p className="text-sm text-white/50 font-sans">
                Check your grow environment in seconds. Enter temp and humidity, get instant diagnosis for your growth stage.
              </p>
            </div>
            <div className="flex items-center gap-2 text-landing-green text-sm font-semibold font-sans whitespace-nowrap flex-shrink-0">
              Use the calculator
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </div>
      </section>

      {/* Search */}
      <section className="relative z-10 px-4 sm:px-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search grow guides by topic, pest, nutrient, VPD, harvest, app, or symptom"
              aria-label="Search grow guides"
              className="h-12 rounded-2xl border-white/[0.08] bg-white/[0.04] pl-11 pr-12 text-white placeholder:text-white/35 focus-visible:ring-landing-green/50 focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear grow guide search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="relative z-10 py-8 sm:py-12 px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-white/70 font-sans mb-8">
            {normalizedQuery ? `Search Results (${filteredGuides.length})` : `All Grow Guides (${growGuides.length})`}
          </h2>
          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGuides.map((guide, i) => (
                <motion.div
                  key={guide.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={`/grow-guides/${guide.slug}`}
                    className="group block h-full rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent hover:border-landing-green/30 hover:from-white/[0.07] transition-all duration-300 p-6 space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-landing-green/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-landing-green" />
                      </div>
                      <h3 className="text-base font-semibold text-white leading-snug font-sans group-hover:text-landing-green transition-colors duration-200">
                        {guide.title}
                      </h3>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed font-sans">
                      {guide.shortDescription}
                    </p>
                    <div className="flex items-center gap-1.5 text-landing-green text-sm font-medium font-sans">
                      Read guide
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-6 py-10 text-center">
              <p className="text-base font-semibold text-white font-sans">No grow guides found</p>
              <p className="mt-2 text-sm text-white/50 font-sans">
                Try searching for VPD, nutrients, pests, harvest, humidity, or grow apps.
              </p>
            </div>
          )}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
