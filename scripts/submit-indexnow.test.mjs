import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./submit-indexnow.mjs', import.meta.url));
const run = (...urls) => spawnSync(process.execPath, [script, '--dry-run', ...urls], { encoding: 'utf8' });

test('deduplicates exact sitemap URLs without submitting a dry run', () => {
  const result = run('https://www.mastergrowbot.com/', 'https://www.mastergrowbot.com/');
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.dryRun, true);
  assert.deepEqual(output.urlList, ['https://www.mastergrowbot.com/']);
});

test('rejects private, off-site, noncanonical and query-string URLs', () => {
  for (const url of ['https://example.com/', 'https://www.mastergrowbot.com/api/private',
    'https://mastergrowbot.com/', 'https://www.mastergrowbot.com/?email=private',
    'https://www.mastergrowbot.com/#download']) {
    const result = run(url);
    assert.notEqual(result.status, 0, url);
    assert.match(result.stderr, /Only exact public production sitemap URLs/);
  }
});
