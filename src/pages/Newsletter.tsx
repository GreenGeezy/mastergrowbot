import { Helmet } from 'react-helmet-async';
import NewsletterSignup from '@/components/landing/NewsletterSignup';

export default function Newsletter() {
  return (
    <main className="min-h-screen bg-stone-950 px-5 py-12 text-stone-100">
      <Helmet>
        <title>Cannabis AI News &amp; Tools | Monthly briefing</title>
        <meta name="description" content="A free monthly briefing on the news, tools, and research shaping AI in the cannabis industry." />
        <link rel="canonical" href="https://www.mastergrowbot.com/newsletter" />
      </Helmet>
      <div className="mx-auto max-w-3xl">
        <a href="/" className="text-sm underline">MasterGrowbot</a>
        <NewsletterSignup heading="h1" />
        <a className="mt-8 block text-center underline" href="https://www.linkedin.com/company/cannabis-ai-news-and-tools/">Follow Cannabis AI News &amp; Tools on LinkedIn</a>
      </div>
    </main>
  );
}
