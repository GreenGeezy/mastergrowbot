// Apple web sign-in secrets last at most 180 days. Run this again before the printed expiry date, then
// paste the result into Supabase > Authentication > Providers > Apple > Secret Key.
// Usage: node scripts/generate-apple-client-secret.mjs TEAM_ID KEY_ID SERVICES_ID path/to/AuthKey.p8
import { createPrivateKey, sign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const [teamId, keyId, servicesId, keyPath] = process.argv.slice(2);
if (!keyPath) { console.error('Usage: node scripts/generate-apple-client-secret.mjs TEAM_ID KEY_ID SERVICES_ID path/to/AuthKey.p8'); process.exit(1); }
const now = Math.floor(Date.now() / 1000);
const exp = now + 180 * 24 * 60 * 60;
const part = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const body = `${part({ alg: 'ES256', kid: keyId })}.${part({ iss: teamId, iat: now, exp, aud: 'https://appleid.apple.com', sub: servicesId })}`;
const signature = sign('sha256', Buffer.from(body), { key: createPrivateKey(readFileSync(keyPath)), dsaEncoding: 'ieee-p1363' }).toString('base64url');
console.log(`${body}.${signature}`);
console.error(`\nExpires ${new Date(exp * 1000).toDateString()}. Set a reminder two weeks earlier.`);
