import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
  ...defaultSchema,
  attributes: { ...defaultSchema.attributes, '*': [...(defaultSchema.attributes?.['*'] || []), 'className'] },
};

/**
 * Deployed static rewrites are defined per exact path without a trailing slash,
 * so a root-relative link written as `/grow-guides/cannabis-ph-guide/` returns a
 * 404. Strip the trailing slash from same-origin path links while leaving the
 * site root, external URLs, protocol-relative URLs and bare fragments untouched.
 */
function normalizeInternalHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//') || href === '/') return href;
  const boundary = href.search(/[?#]/);
  const path = boundary === -1 ? href : href.slice(0, boundary);
  const suffix = boundary === -1 ? '' : href.slice(boundary);
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' + suffix : trimmed + suffix;
}

/** Render legacy HTML and Markdown through the same sanitized tree. */
export default function GuideContent({ children }: { children: string }) {
  return (
    <div className="guide-content text-base text-white/65 leading-relaxed font-sans overflow-x-auto [&_p]:mb-4 [&_a]:text-landing-green [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
      <ReactMarkdown rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{ a: ({ href, children }) => {
          const normalizedHref = href
            ? normalizeInternalHref(href).replace('com.mastergrowbot.app?utm_', 'com.mastergrowbot.app&utm_')
            : href;
          const ctaLocation = normalizedHref?.includes('apps.apple.com')
            ? 'article-body:ios'
            : normalizedHref?.includes('play.google.com')
              ? 'article-body:android'
              : 'article-body';

          return (
            <a
              href={normalizedHref}
              data-cta-location={ctaLocation}
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        } }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
