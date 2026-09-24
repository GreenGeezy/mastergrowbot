import { AMAZON_BOOK_URL } from './ctaLinks';


interface AmazonBookButtonProps {
  className?: string;
  location?: string;
  imageClassName?: string;
}

export function AmazonBookButton({
  className = '',
  location = 'unknown',
}: AmazonBookButtonProps) {
  const handleClick = () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'amazon_book_click', {
        link_url: AMAZON_BOOK_URL,
        location,
      });
    }
  };

  return (
    <a
      href={AMAZON_BOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Available on Amazon, opens in new tab"
      data-cta-location={`${location}:amazon-book`}
      data-analytics-manual="true"
      onClick={handleClick}
      className={`group inline-flex items-center justify-center ${className}`}
    >
      <span className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-amber-200/40 bg-amber-100 px-6 py-3 text-sm font-bold text-black transition hover:bg-white">View the book on Amazon <span aria-hidden="true">↗</span></span>
    </a>
  );
}
