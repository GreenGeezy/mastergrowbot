import { Helmet } from 'react-helmet-async';

const DEFAULT_OG_IMAGE = 'https://www.mastergrowbot.com/lovable-uploads/cdeebe66-3489-4cb2-a2e7-0a4763d845ce.png';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  pageType?: 'website' | 'article';
  publishedDate?: string;
  modifiedDate?: string;
}

export default function SEOHead({
  title,
  description,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  pageType = 'website',
  publishedDate,
  modifiedDate,
}: SEOHeadProps) {
  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MasterGrowbot AI" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article dates (grow guide pages) */}
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
    </Helmet>
  );
}
