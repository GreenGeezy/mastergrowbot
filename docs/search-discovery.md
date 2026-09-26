# Search discovery after a release

Google: inspect important changed URLs in the authenticated Search Console browser for `sc-domain:mastergrowbot.com` (agcomsol@gmail.com). Request indexing only after verifying publication and indexability. GSC Wizard is no longer used; its trial ended. Do not use Google's Indexing API for ordinary pages.

IndexNow: the public ownership token is intentionally served at `/indexnow-key.txt`; it is not an account credential. After production verification, notify participating engines once for the explicitly changed public sitemap URLs:

```sh
node scripts/submit-indexnow.mjs --dry-run https://www.mastergrowbot.com/
node scripts/submit-indexnow.mjs https://www.mastergrowbot.com/
```

The script verifies the deployed key, live sitemap and successful HTML responses before sending one batch, and saves a receipt outside the website in `../organic-growth-state/`. It does not run on builds/previews or notify unchanged pages on every scheduled cycle. Review prior receipts before submitting. A 200 acknowledges submission; 202 means key verification is pending. Neither proves crawling, indexing, rankings or AI citations. Rendered canonical/robots checks remain part of release validation because this site's metadata is client-rendered.

Brave: https://search.brave.com/submit-url offers a URL re-fetch form. Submit important changed public URLs sparingly and record the visible result; do not equate submission with indexing. If an interactive CAPTCHA appears, stop for user confirmation. Do not retry in loops.

References checked 2026-09-26: https://www.indexnow.org/documentation and https://www.indexnow.org/faq. IndexNow distributes notifications to participating engines, including Bing. Do not claim it submits to Google or Brave.
