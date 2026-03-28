import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { growGuides } from '@/data/growGuides';

const APP_STORE_URL =
  'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=grow-guides';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.mastergrowbot.app&utm_source=website&utm_medium=organic&utm_campaign=grow-guides';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mastergrowbot.com/' },
    { '@type': 'ListItem', position: 2, name: 'Grow Guides', item: 'https://www.mastergrowbot.com/grow-guides' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is MasterGrowbot AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MasterGrowbot AI is a premium mobile app that uses artificial intelligence to help cannabis growers diagnose plant problems, optimize yields, and manage their grows from seed to harvest.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do cannabis grow guides help me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our grow guides cover common cultivation challenges like nutrient deficiencies, pest identification, and harvest timing. Combined with MasterGrowbot AI\'s photo diagnosis feature, you can solve plant problems in seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is MasterGrowbot AI free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MasterGrowbot AI offers a free 3-day trial so you can experience AI-powered plant diagnosis, grow tracking, and personalized cultivation plans before subscribing.',
      },
    },
  ],
};

export default function GrowGuidesHub() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEOHead
        title="Cannabis Grow Guides | MasterGrowbot AI"
        description="Free expert cannabis grow guides covering nutrients, pests, harvest timing, and more. Powered by MasterGrowbot AI's plant diagnosis technology."
        canonicalUrl="https://www.mastergrowbot.com/grow-guides"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
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
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-landing-green text-black font-semibold text-sm px-5 py-3 rounded-xl hover:bg-landing-green/90 transition-colors duration-200 font-sans"
            >
              Get instant AI plant diagnosis
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/50 hover:text-white/80 transition-colors font-sans"
            >
              Download MasterGrowbot AI - Free 3-Day Trial
            </a>
          </motion.div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="relative z-10 py-8 sm:py-12 px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-white/70 font-sans mb-8">
            All Grow Guides ({growGuides.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {growGuides.map((guide, i) => (
              <motion.div
                key={guide.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
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
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
