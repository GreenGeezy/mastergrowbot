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
        description="Keep plant photos, AI observations and your grow journal together with MasterGrowbot AI on iOS and Android. Eligible new Pro subscribers can try 3 days free."
        canonicalUrl="https://www.mastergrowbot.com/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(homepageFaqSchema)}</script>
      </Helmet>
      <LandingPage />
    </>
  );
}
