/**
 * generate-article.mjs
 * Reads scripts/article-queue.json, picks the first unpublished entry,
 * calls OpenRouter (Claude Sonnet 4) to generate a full SEO article,
 * appends it to src/data/growGuides.ts, updates public/sitemap.xml,
 * and logs the result to scripts/published-articles-log.json.
 *
 * Exit 0 = success (or no key / queue empty)
 * Exit 1 = hard error (API failure, parse failure, file write failure)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// ── paths ──────────────────────────────────────────────────────────────────
const QUEUE_PATH     = join(__dirname, 'article-queue.json');
const LOG_PATH       = join(__dirname, 'published-articles-log.json');
const GUIDES_PATH    = join(ROOT, 'src', 'data', 'growGuides.ts');
const SITEMAP_PATH   = join(ROOT, 'public', 'sitemap.xml');

// ── helpers ────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function todayISO() {
  const d = new Date();
  return `${d.toISOString().split('T')[0]}T00:00:00Z`;
}

function escapeTemplateLiteral(str) {
  // Escape backticks and template expression starts so content is safe inside `...`
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildTableHtml(headers, rows) {
  const headerCells = headers.map(h => `<th class="border border-white/20 px-3 py-2 text-left text-landing-green text-sm font-semibold">${escapeHtml(h)}</th>`).join('');
  const bodyRows = rows.map(row =>
    `<tr>${row.map(cell => `<td class="border border-white/20 px-3 py-2 text-white/70 text-sm">${escapeHtml(cell)}</td>`).join('')}</tr>`
  ).join('\n        ');
  return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-white/20 rounded-lg"><thead><tr>${headerCells}</tr></thead><tbody>\n        ${bodyRows}\n        </tbody></table></div>`;
}

function articleToTS(article) {
  const sections = article.sections.map(s => {
    if (s.type === 'table') {
      const html = buildTableHtml(s.headers || [], s.rows || []);
      return `    {
      heading: ${JSON.stringify(s.heading)},
      bodyHtml: \`${escapeTemplateLiteral(html)}\`,
    }`;
    }
    return `    {
      heading: ${JSON.stringify(s.heading)},
      body: \`${escapeTemplateLiteral(s.body || '')}\`,
    }`;
  });

  const faqs = article.faqs.map(f =>
    `    {
      question: ${JSON.stringify(f.question)},
      answer: ${JSON.stringify(f.answer)},
    }`
  );

  const relatedSlugsStr = article.relatedSlugs.map(s => JSON.stringify(s)).join(', ');

  return `
  // ${'─'.repeat(61)}
  // AUTO-PUBLISHED: ${article.title}
  // ${'─'.repeat(61)}
  {
    slug: ${JSON.stringify(article.slug)},
    title: ${JSON.stringify(article.title)},
    h1: ${JSON.stringify(article.h1)},
    shortDescription: ${JSON.stringify(article.shortDescription || '')},
    metaTitle: ${JSON.stringify(article.metaTitle)},
    metaDescription: ${JSON.stringify(article.metaDescription)},
    publishedDate: ${JSON.stringify(article.publishedDate)},
    modifiedDate: ${JSON.stringify(article.modifiedDate)},
    intro: \`${escapeTemplateLiteral(article.intro)}\`,
    sections: [
${sections.join(',\n')}
    ],
    faqs: [
${faqs.join(',\n')}
    ],
    relatedSlugs: [${relatedSlugsStr}],
  },`;
}

// ── system prompt ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior cannabis cultivation content strategist and expert grower writing for MasterGrowbot AI (mastergrowbot.com). You write for serious growers who want real, actionable information. Your content must rank on page 1 of Google. Follow every rule below exactly.

VOICE AND EXPERTISE:
- Write as a seasoned master grower mentoring a fellow grower -- expert, direct, approachable.
- Use first-person grower observations naturally: "In practice...", "What I've seen consistently...", "Every experienced grower knows..."
- Never use corporate or generic language. No filler phrases.
- Never use em dashes. Use hyphens (-), commas, colons, or restructure the sentence.

SEO RULES:
- Target keyword appears in the first sentence or first paragraph.
- Use the target keyword naturally in at least 2 H2 headings.
- Each H2 section must be 200-350 words minimum.
- Use numbered lists for any step-by-step process.
- Use a comparison table (as a "table" type object in sections) whenever the article compares two or more things side by side.
- Open with a 50-70 word introductory paragraph that directly answers the core question and includes the target keyword. This paragraph must be able to stand alone as a Google featured snippet.

CTA RULES:
- Include a CTA to download MasterGrowbot AI within the first 300 words of the intro.
- The last section before FAQs must have heading "Grow Smarter with MasterGrowbot AI" and be a 100-150 word pitch for the app including the free trial offer.
- App Store URL: https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=[article-slug]
- Google Play URL: https://play.google.com/store/apps/details?id=com.mastergrowbot.app?utm_source=website&utm_medium=organic&utm_campaign=[article-slug]
- The closing CTA section body must include both store links with the article's UTM params substituted in.

INTERNAL LINKING RULES:
- In the article body (sections), include at least 2 markdown links to other grow guides using format: [anchor text](/grow-guides/[slug]/)
- Include at least 1 link to the homepage: [MasterGrowbot AI](/)
- Include at least 1 link to the hub: [grow guides hub](/grow-guides/)
- Where relevant to environmental control, link to the VPD calculator: [VPD calculator](/vpd-calculator/)
- Use the relatedSlugs from the queue entry as the guides to link to.
- Use descriptive, keyword-rich anchor text only. Never "click here."

FAQ RULES:
- Phrased exactly as a grower types them into Google.
- Use "How do I...", "What causes...", "Can I...", "Is it safe to...", "What is the best..." formats.
- Each answer: 2-3 sentences -- a direct answer, then one supporting detail.
- At least 1 FAQ must mention MasterGrowbot AI by name and describe a specific feature.

ACCURACY RULES:
- All growing data (pH ranges, temperatures, humidity, nutrient ratios, timelines) must be accurate and specific.
- For disease/pest articles: include the scientific name in at least one heading or the intro.
- For deficiency articles: describe visual symptoms (color, texture, pattern, which leaves are affected first) and the systemic cause.

Respond with ONLY valid JSON. No markdown code fences. No explanation before or after the JSON. Structure:

{
  "slug": "from-spec",
  "title": "from-spec",
  "h1": "from-spec",
  "shortDescription": "2-sentence summary for the hub card, includes target keyword",
  "metaTitle": "from-spec",
  "metaDescription": "from-spec",
  "publishedDate": "today-iso",
  "modifiedDate": "today-iso",
  "intro": "200-280 words. First sentence contains target keyword. CTA within 300 words. First 70 words are featured snippet bait.",
  "sections": [
    {
      "heading": "H2 heading",
      "body": "250-350 words. Markdown links to related guides per internal linking rules."
    },
    {
      "type": "table",
      "heading": "Comparison heading -- only include when comparing 2+ things",
      "headers": ["Column 1", "Column 2", "Column 3"],
      "rows": [["Row data", "Row data", "Row data"]]
    }
  ],
  "faqs": [
    {
      "question": "How do I [exact grower search query]?",
      "answer": "Direct answer. Supporting detail. Optional MasterGrowbot mention."
    }
  ],
  "relatedSlugs": ["from-spec"]
}`;

// ── build user message from queue entry ────────────────────────────────────

function buildUserMessage(entry) {
  const sectionList = entry.sections.map((s, i) => `  ${i + 1}. ${s.heading}`).join('\n');
  return `Generate the full article following all system prompt rules.

Article spec:
- slug: ${entry.slug}
- title: ${entry.title}
- h1: ${entry.h1}
- metaTitle: ${entry.metaTitle}
- metaDescription: ${entry.metaDescription}
- targetKeyword: ${entry.targetKeyword}
- secondaryKeywords: ${entry.secondaryKeywords.join(', ')}
- faqCount: ${entry.faqCount}

Required H2 sections (use these headings exactly):
${sectionList}

Link to these related guides in the article body (use descriptive anchor text):
${entry.relatedSlugs.map(s => `  - /grow-guides/${s}/`).join('\n')}

publishedDate and modifiedDate: ${todayISO()}

Total word count: 2,200-2,800 words. Never use em dashes.`;
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  // Check API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('OPENROUTER_API_KEY not set. Article generation will run via GitHub Actions (Mon/Wed/Fri 2pm UTC).');
    process.exit(0);
  }

  // Read and validate queue
  let queue;
  try {
    queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  } catch (err) {
    console.error('Failed to read/parse article-queue.json:', err.message);
    process.exit(1);
  }

  // Find first unpublished entry
  const entry = queue.find(a => !a.published);
  if (!entry) {
    console.log('Queue empty -- no articles to publish.');
    process.exit(0);
  }

  console.log(`Generating article: "${entry.title}" (${entry.slug})`);

  // Call OpenRouter API
  let rawContent;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://www.mastergrowbot.com',
        'X-Title': 'MasterGrowbot SEO Generator',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        max_tokens: 10000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(entry) },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`OpenRouter API error ${response.status}:`, errBody);
      process.exit(1);
    }

    const data = await response.json();
    rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) {
      console.error('Empty response from OpenRouter. Full response:', JSON.stringify(data, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error('API call failed:', err.message);
    process.exit(1);
  }

  // Strip markdown code fences if present
  let jsonStr = rawContent.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  // Parse response
  let article;
  try {
    article = JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to parse API response as JSON:', err.message);
    console.error('Raw response:', rawContent);
    process.exit(1);
  }

  // Validate required fields
  const required = ['slug', 'title', 'h1', 'metaTitle', 'metaDescription', 'intro', 'sections', 'faqs'];
  for (const field of required) {
    if (!article[field]) {
      console.error(`Missing required field in API response: ${field}`);
      process.exit(1);
    }
  }

  // Ensure slug matches queue entry
  article.slug = entry.slug;
  article.metaTitle = entry.metaTitle;
  article.metaDescription = entry.metaDescription;
  article.relatedSlugs = entry.relatedSlugs;
  if (!article.publishedDate) article.publishedDate = todayISO();
  if (!article.modifiedDate)  article.modifiedDate  = todayISO();
  if (!article.shortDescription) article.shortDescription = `${entry.title}. Expert guide for cannabis growers.`;

  // ── Update growGuides.ts ─────────────────────────────────────────────────
  try {
    let guidesContent = readFileSync(GUIDES_PATH, 'utf8');

    // Find insertion point: right before "];\n\nexport function"
    const marker = '\n];\n\nexport function';
    const markerIdx = guidesContent.indexOf(marker);
    if (markerIdx === -1) {
      console.error('Could not find insertion point in growGuides.ts. Expected pattern: "];" followed by "export function".');
      process.exit(1);
    }

    const articleTS = articleToTS(article);
    guidesContent = guidesContent.slice(0, markerIdx) + articleTS + guidesContent.slice(markerIdx);
    writeFileSync(GUIDES_PATH, guidesContent, 'utf8');
    console.log('Updated src/data/growGuides.ts');
  } catch (err) {
    console.error('Failed to update growGuides.ts:', err.message);
    process.exit(1);
  }

  // ── Update sitemap.xml ───────────────────────────────────────────────────
  try {
    let sitemapContent = readFileSync(SITEMAP_PATH, 'utf8');
    const newUrl = `  <url>
    <loc>https://www.mastergrowbot.com/grow-guides/${article.slug}/</loc>
    <lastmod>${today()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    sitemapContent = sitemapContent.replace('</urlset>', `${newUrl}\n</urlset>`);
    writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
    console.log('Updated public/sitemap.xml');
  } catch (err) {
    console.error('Failed to update sitemap.xml:', err.message);
    process.exit(1);
  }

  // ── Update published-articles-log.json ──────────────────────────────────
  try {
    let log = [];
    if (existsSync(LOG_PATH)) {
      log = JSON.parse(readFileSync(LOG_PATH, 'utf8'));
    }
    log.push({
      slug: article.slug,
      title: article.title,
      url: `https://www.mastergrowbot.com/grow-guides/${article.slug}/`,
      publishedDate: article.publishedDate,
      submittedToSearchConsole: false,
    });
    writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + '\n', 'utf8');
    console.log('Updated scripts/published-articles-log.json');
  } catch (err) {
    console.error('Failed to update published-articles-log.json:', err.message);
    process.exit(1);
  }

  // ── Mark as published in queue ───────────────────────────────────────────
  try {
    entry.published = true;
    entry.publishedDate = article.publishedDate;
    writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n', 'utf8');
    console.log('Marked as published in article-queue.json');
  } catch (err) {
    console.error('Failed to update article-queue.json:', err.message);
    process.exit(1);
  }

  console.log(`\nPublished: ${article.title} at /grow-guides/${article.slug}/`);
}

main();
