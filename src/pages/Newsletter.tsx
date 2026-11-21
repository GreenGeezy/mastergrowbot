import { Helmet } from 'react-helmet-async';
import NewsletterSignup from '@/components/landing/NewsletterSignup';
import ReactMarkdown from 'react-markdown';

// Only approved issues belong in this directory. Dated filenames sort newest first.
const published = import.meta.glob<string>('../data/newsletter/published/*.md', {
  eager: true, query: '?raw', import: 'default',
});

export default function Newsletter() {
  return (
    <main className="min-h-screen bg-stone-950 px-5 py-12 text-stone-100">
      <Helmet>
        <title>Cannabis AI News &amp; Tools | Weekly newsletter</title>
        <meta name="description" content="Weekly cannabis technology reporting, AI tools and a free workbench for cultivation, retail and operations teams." />
        <link rel="canonical" href="https://www.mastergrowbot.com/newsletter" />
      </Helmet>
      <div className="mx-auto max-w-3xl">
        <a href="/" className="text-sm underline">MasterGrowbot</a>
        <NewsletterSignup heading="h1" />
        {Object.keys(published).sort().reverse().map(path => (
          <article key={path} id={path.split('/').pop()?.replace(/\.md$/, '')} className="prose prose-invert mx-auto mt-12 prose-a:text-emerald-300">
            <ReactMarkdown components={{ h1: 'h2' }}>{published[path]}</ReactMarkdown>
          </article>
        ))}
        <a className="mt-8 block text-center underline" href="https://www.linkedin.com/company/cannabis-ai-news-and-tools/">Follow Cannabis AI News &amp; Tools on LinkedIn</a>
      </div>
    </main>
  );
}
