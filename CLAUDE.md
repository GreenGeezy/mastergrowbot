# MasterGrowbot AI — Project Instructions for Claude Code

## Project Overview
MasterGrowbot AI is a premium cannabis cultivation assistant app (iOS + Android). This website (mastergrowbot.com) is a React/Vite site deployed to Vercel via GitHub. Every push to `main` triggers an automatic deployment.

- GitHub Repository: https://github.com/GreenGeezy/mastergrowbot.git
- Live Site: https://www.mastergrowbot.com
- iOS App: https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060
- Android App: https://play.google.com/store/apps/details?id=com.mastergrowbot.app

## Google Analytics
- Measurement ID: G-NT1046S3EN
- Stream ID: 14270987915
- Custom events to track via gtag: app_store_click, play_store_click
- GA4 script must be added to the <head> of every page
- On App Store button clicks, fire: gtag('event', 'app_store_click', {'link_url': 'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060'})
- On Google Play button clicks, fire: gtag('event', 'play_store_click', {'link_url': 'https://play.google.com/store/apps/details?id=com.mastergrowbot.app'})

## App Store Links (use these exact URLs everywhere)
- iOS App Store: https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060
- Google Play Store: https://play.google.com/store/apps/details?id=com.mastergrowbot.app
- Always append UTM parameters to these links: ?utm_source=website&utm_medium=organic&utm_campaign=[page-slug]
- Homepage example: https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=homepage
- Grow guide example: https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=cannabis-nutrient-deficiency-guide

## SEO Rules (Apply to EVERY page and component you create or edit)

### Required Meta Tags (every page)
- `<title>` — Under 60 characters, contains page's primary keyword, ends with "| MasterGrowbot AI"
- `<meta name="description">` — Under 160 characters, contains a call-to-action, mentions the app
- `<link rel="canonical">` — Self-referencing canonical URL (https://www.mastergrowbot.com/[path])
- Open Graph tags: og:title, og:description, og:image, og:url, og:type, og:site_name="MasterGrowbot AI"
- Twitter Card: twitter:card="summary_large_image", twitter:title, twitter:description, twitter:image

### Required Schema Markup
- Homepage: MobileApplication + Organization + FAQPage JSON-LD
- Grow guide articles: Article + BreadcrumbList + FAQPage JSON-LD
- Grow guides hub: FAQPage + BreadcrumbList JSON-LD

### Content Standards (for grow guide articles)
- H1: One per page, contains the primary target keyword
- H2s: Contain secondary keywords, logical hierarchy (never skip H1 to H3)
- Word count: 1,200-2,500 words
- Voice: Expert but approachable — like a seasoned master grower mentoring a friend
- Include a CTA to download the app within the first 300 words
- Include a closing CTA with "Download free with a 3-day trial" messaging
- Include FAQ schema with 3-5 questions per article
- Include at least 2 internal links: one to /grow-guides/ hub, one to homepage or another guide
- Include at least 1 app store link with UTM parameters (see App Store Links section above for exact URLs)
- All images must have descriptive alt text that includes relevant keywords
- NEVER use em dashes in any article text, page copy, headings, meta descriptions, CTAs, FAQ answers, or any user-facing written content. Use regular hyphens (-), commas, colons, semicolons, or rewrite the sentence to avoid dashes entirely. This rule applies to all grow guides, landing pages, hub pages, and any visible text. It does NOT apply to code logic, analytics strings, or JSON-LD schema.

### Internal Linking Rules
- Every grow guide links to the /grow-guides/ hub page
- Every grow guide links to at least one other grow guide
- Every page links to the homepage
- When a grow guide mentions a topic covered by another guide, link to it with descriptive anchor text (not "click here")

### URL Structure
- Homepage: /
- Grow Guides Hub: /grow-guides/
- Individual Guides: /grow-guides/[keyword-slug]/
- German Landing Page: /de/
- Features: /features/ (future)
- Press Kit: /press/ (future)

### Technical SEO
- All pages must be statically generated or server-side rendered (no client-side-only content for search engines)
- Sitemap at /sitemap.xml must include all pages with lastmod dates
- robots.txt at root must reference the sitemap URL: https://www.mastergrowbot.com/sitemap.xml
- All App Store/Google Play links must include UTM parameters (see App Store Links section)
- Images must be in WebP format where possible, with explicit width and height attributes
- All pages must have a self-referencing canonical tag
- HTTPS must be enforced; bare domain (mastergrowbot.com) must 301 redirect to www.mastergrowbot.com

### Brand Terms for CTAs
- App name: "MasterGrowbot AI" (always include "AI")
- Primary CTA: "Download MasterGrowbot AI — Free 3-Day Trial"
- Secondary CTA: "Snap a photo. Save your plant. Try MasterGrowbot AI free."
- Value proposition: "Your AI master grower, in your pocket"

## Schema Templates

### MobileApplication (homepage only)
```json
{
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "MasterGrowbot AI",
  "description": "The world's most advanced AI cannabis cultivation assistant. Diagnose plant problems, track grows, and maximize yields.",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "iOS 15.0+, Android 8.0+",
  "offers": [
    {"@type": "Offer", "price": "0", "priceCurrency": "USD", "description": "3-Day Free Trial"},
    {"@type": "Offer", "price": "7.99", "priceCurrency": "USD", "description": "Weekly"},
    {"@type": "Offer", "price": "29.99", "priceCurrency": "USD", "description": "Monthly"},
    {"@type": "Offer", "price": "199.99", "priceCurrency": "USD", "description": "Annual Pro"}
  ],
  "downloadUrl": [
    "https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060",
    "https://play.google.com/store/apps/details?id=com.mastergrowbot.app"
  ],
  "featureList": "AI Plant Diagnosis, Strain Database, Grow Journal, Daily Tasks, Harvest Window Detection, VPD Tracking"
}
```

### Organization (homepage only)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MasterGrowbot AI",
  "url": "https://www.mastergrowbot.com",
  "logo": "https://www.mastergrowbot.com/logo.png",
  "sameAs": [
    "https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060",
    "https://play.google.com/store/apps/details?id=com.mastergrowbot.app",
    "https://github.com/GreenGeezy/mastergrowbot.git"
  ]
}
```

### Article (each grow guide)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "ARTICLE_TITLE",
  "description": "META_DESCRIPTION",
  "image": "https://www.mastergrowbot.com/lovable-uploads/cdeebe66-3489-4cb2-a2e7-0a4763d845ce.png",
  "author": {"@type": "Organization", "name": "MasterGrowbot AI", "url": "https://www.mastergrowbot.com"},
  "publisher": {
    "@type": "Organization",
    "name": "MasterGrowbot AI",
    "logo": {"@type": "ImageObject", "url": "https://www.mastergrowbot.com/logo.png"}
  },
  "datePublished": "YYYY-MM-DDT00:00:00Z",
  "dateModified": "YYYY-MM-DDT00:00:00Z",
  "mainEntityOfPage": "CANONICAL_URL"
}
```

### BreadcrumbList (grow guide pages)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.mastergrowbot.com/"},
    {"@type": "ListItem", "position": 2, "name": "Grow Guides", "item": "https://www.mastergrowbot.com/grow-guides/"},
    {"@type": "ListItem", "position": 3, "name": "ARTICLE_TITLE"}
  ]
}
```

### FAQPage (every page with FAQ)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "QUESTION", "acceptedAnswer": {"@type": "Answer", "text": "ANSWER"}}
  ]
}
```

## Self-Check Before Committing

Before committing any page changes, Claude Code MUST verify ALL of the following. If any check fails, fix it before committing.

### Meta & Head Tags
1. Title tag exists, is under 60 characters, and contains the page's primary target keyword
2. Meta description exists, is under 160 characters, and contains a call-to-action mentioning the app or free trial
3. Canonical tag is present and points to the correct self-referencing URL (https://www.mastergrowbot.com/[path])
4. Open Graph tags are all present: og:title, og:description, og:image, og:url, og:type, og:site_name
5. Twitter Card tags are all present: twitter:card, twitter:title, twitter:description, twitter:image
6. GA4 script tag with Measurement ID G-NT1046S3EN is loaded in the page head

### Content Structure
7. Exactly one H1 tag exists on the page, and it contains the primary target keyword
8. Heading hierarchy is logical with no skips (H1 → H2 → H3, never H1 → H3)
9. For grow guide articles: word count is between 1,200 and 2,500 words (pillar content up to 3,000)
10. For grow guide articles: a CTA to download MasterGrowbot AI appears within the first 300 words
11. For grow guide articles: a closing CTA with "Download free with a 3-day trial" appears near the end

### Schema Markup
12. Appropriate JSON-LD schema is present in the page head:
    - Homepage: MobileApplication + Organization + FAQPage
    - Grow guide articles: Article + BreadcrumbList + FAQPage
    - Grow guides hub: FAQPage + BreadcrumbList
13. All schema uses the real app store URLs (not placeholder text)
14. Article schema includes correct datePublished and dateModified in full ISO 8601 format with timezone (YYYY-MM-DDT00:00:00Z)

### Links & CTAs
15. At least 2 internal links exist on the page: one to /grow-guides/ hub and one to the homepage or another guide
16. At least 1 App Store CTA link uses the full URL with UTM parameters:
    - iOS: https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=[page-slug]
    - Android: https://play.google.com/store/apps/details?id=com.mastergrowbot.app?utm_source=website&utm_medium=organic&utm_campaign=[page-slug]
17. App Store button click events fire the correct gtag events (app_store_click, play_store_click)
18. No broken internal links (all linked pages exist or are planned)

### Images & Accessibility
19. All images have descriptive alt text that includes relevant keywords (e.g., "MasterGrowbot AI cannabis plant scan showing nitrogen deficiency")
20. All images specify explicit width and height attributes
21. Images use WebP format where possible

### Final Verification
22. The page is server-side rendered or statically generated (not client-side-only rendering that search engines cannot see)
23. The sitemap generator will include this new page
24. The page follows the correct URL structure from the URL Structure section above
