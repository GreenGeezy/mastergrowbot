/**
 * add-to-queue.mjs
 * Usage: node scripts/add-to-queue.mjs --slug "slug" --title "Title" --keyword "target keyword"
 * Appends a new entry to scripts/article-queue.json.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const QUEUE_PATH = join(__dirname, 'article-queue.json');

// ── parse CLI args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const slug    = getArg('--slug');
const title   = getArg('--title');
const keyword = getArg('--keyword');

if (!slug || !title || !keyword) {
  console.error('Usage: node scripts/add-to-queue.mjs --slug "slug" --title "Title" --keyword "target keyword"');
  process.exit(1);
}

// ── auto-generate metaTitle and metaDescription ────────────────────────────
const suffix   = ' | MasterGrowbot AI';
const rawMeta  = `${title}${suffix}`;
const metaTitle = rawMeta.length <= 60 ? rawMeta : `${title.slice(0, 60 - suffix.length - 1)}${suffix}`.trim();

const rawDesc  = `${title}. Expert guide for cannabis growers. Try MasterGrowbot AI free.`;
const metaDescription = rawDesc.length <= 160 ? rawDesc : rawDesc.slice(0, 157) + '...';

// ── build new entry ────────────────────────────────────────────────────────
const newEntry = {
  slug,
  title,
  h1: title,
  metaTitle,
  metaDescription,
  targetKeyword: keyword,
  secondaryKeywords: [],
  sections: [],
  faqCount: 5,
  relatedSlugs: [],
  published: false,
  publishedDate: null,
};

// ── read existing queue and append ────────────────────────────────────────
let queue = [];
if (existsSync(QUEUE_PATH)) {
  try {
    queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  } catch (err) {
    console.error('Failed to parse article-queue.json:', err.message);
    process.exit(1);
  }
}

// Check for duplicate slug
if (queue.find(e => e.slug === slug)) {
  console.error(`Slug "${slug}" already exists in the queue.`);
  process.exit(1);
}

queue.push(newEntry);
writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n', 'utf8');

console.log(`Added to queue: "${title}" (${slug})`);
console.log(`metaTitle (${metaTitle.length} chars): ${metaTitle}`);
console.log(`metaDescription (${metaDescription.length} chars): ${metaDescription}`);
console.log('');
console.log('REMINDER: Edit article-queue.json to fill in:');
console.log('  - sections (array of {heading} objects)');
console.log('  - relatedSlugs (only confirmed live slugs)');
console.log('  - secondaryKeywords');
console.log('  - faqCount');
