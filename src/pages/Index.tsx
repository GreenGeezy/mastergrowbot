import { Helmet } from 'react-helmet-async';
import LandingPage from '@/components/landing/LandingPage';
import SEOHead from '@/components/SEOHead';

import { appFaqs } from '@/data/appFaqs';

const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: appFaqs.map(({ question, answer }) => ({
    '@type': 'Question', name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
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
