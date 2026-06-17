import { AMAZON_BOOK_URL } from './ctaLinks';

const AMAZON_BUTTON_IMAGE_URL = 'https://www.niftybuttons.com/amazon/amazon-button9.png';

interface AmazonBookButtonProps {
  className?: string;
  location?: string;
  imageClassName?: string;
}

export function AmazonBookButton({
  className = '',
  location = 'unknown',
  imageClassName = '',
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
      data-cta-location={`${location}:amazon-book`}
      data-analytics-manual="true"
      onClick={handleClick}
      className={`group inline-flex items-center justify-center ${className}`}
    >
      <img
        src={AMAZON_BUTTON_IMAGE_URL}
        alt="Buy The Master Cannabis IPM Playbook on Amazon"
        className={`h-[58px] w-auto max-w-[220px] rounded-lg transition-transform duration-200 group-hover:scale-[1.03] sm:h-[65px] ${imageClassName}`}
      />
    </a>
  );
}
