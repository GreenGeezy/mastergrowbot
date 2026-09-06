import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
  ...defaultSchema,
  attributes: { ...defaultSchema.attributes, '*': [...(defaultSchema.attributes?.['*'] || []), 'className'] },
};

/** Render legacy HTML and Markdown through the same sanitized tree. */
export default function GuideContent({ children }: { children: string }) {
  return (
    <div className="guide-content text-base text-white/65 leading-relaxed font-sans overflow-x-auto [&_p]:mb-4 [&_a]:text-landing-green [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
      <ReactMarkdown rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{ a: ({ href, children }) => (
          <a href={href?.replace('com.mastergrowbot.app?utm_', 'com.mastergrowbot.app&utm_')}
            data-cta-location="article-body" rel="noopener noreferrer">{children}</a>
        ) }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
