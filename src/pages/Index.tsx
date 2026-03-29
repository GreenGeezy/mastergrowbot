import { Helmet } from 'react-helmet-async';
import LandingPage from '@/components/landing/LandingPage';
import SEOHead from '@/components/SEOHead';

const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does MasterGrowbot AI do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MasterGrowbot AI is the most advanced cannabis growing app. It uses AI-powered photo analysis to diagnose pests, diseases, and nutrient deficiencies, plus features a strain database, grow journal, and personalized daily tasks.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI plant scan work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Take a photo of your cannabis plant and MasterGrowbot AI instantly analyzes it to identify issues like spider mites, powdery mildew, nitrogen deficiency, and more - with treatment recommendations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, MasterGrowbot AI offers a free 3-day trial on both iOS and Android. No credit card required to start.',
      },
    },
    {
      '@type': 'Question',
      name: 'What platforms is MasterGrowbot available on?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MasterGrowbot AI is available for iPhone (iOS) and Android devices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can MasterGrowbot identify cannabis pests and diseases?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. MasterGrowbot AI can identify common cannabis pests like spider mites and aphids, diseases like powdery mildew and botrytis, and nutrient deficiencies including nitrogen, calcium, and magnesium issues.',
      },
    },
  ],
};

export default function Index() {
  return (
    <>
      <SEOHead
        title="MasterGrowbot AI: Cannabis Growing App | AI Plant Diagnosis | iOS & Android"
        description="Grow bigger, healthier cannabis with MasterGrowbot AI. Photo-based plant diagnosis, strain tips, grow journal, and daily tasks. Try free for 3 days. iOS & Android."
        canonicalUrl="https://www.mastergrowbot.com/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(homepageFaqSchema)}</script>
      </Helmet>
      <LandingPage />
    </>
  );
}
