import LandingPage from '@/components/landing/LandingPage';
import SEOHead from '@/components/SEOHead';

export default function Index() {
  return (
    <>
      <SEOHead
        title="MasterGrowbot AI: Cannabis Growing App | AI Plant Diagnosis | iOS & Android"
        description="Grow bigger, healthier cannabis with MasterGrowbot AI. Photo-based plant diagnosis, strain tips, grow journal, and daily tasks. Try free for 3 days. iOS & Android."
        canonicalUrl="https://www.mastergrowbot.com/"
      />
      <LandingPage />
    </>
  );
}
