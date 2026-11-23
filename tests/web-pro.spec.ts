import { test, expect, type Page } from 'playwright/test';

// Build with test plan IDs, serve dist, then run:
//   NEXT_PUBLIC_WHOP_WEB_PRO_ANNUAL_PLAN_ID=plan_TESTannual NEXT_PUBLIC_WHOP_WEB_PRO_MONTHLY_PLAN_ID=plan_TESTmonthly npm run build
//   node scripts/serve-static.mjs
//   PLAYWRIGHT_BASE_URL=http://127.0.0.1:8090 npx playwright test tests/web-pro.spec.ts
// Every Supabase and Whop request is answered here. Nothing reaches production and nothing is charged.

const USER = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', email: 'grower@example.test', is_anonymous: false, app_metadata: { provider: 'email' }, user_metadata: {}, created_at: '2026-11-01T00:00:00Z' };
const b64 = (v: object) => Buffer.from(JSON.stringify(v)).toString('base64url');
const session = () => {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return { access_token: `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER.id, exp, role: 'authenticated' })}.sig`, refresh_token: 'r', token_type: 'bearer', expires_in: 3600, expires_at: exp, user: USER };
};
const usage = { used: 3, limit: 40 };
const inactive = { active: false, planId: null, status: null, renewsAt: null, cancelAtPeriodEnd: false, manageUrl: null, usage: { used: 0, limit: 40 } };
const activeAccess = { active: true, planId: 'plan_TESTannual', status: 'active', renewsAt: '2027-11-23T00:00:00Z', cancelAtPeriodEnd: false, manageUrl: 'https://whop.com/billing/manage/mber_1/', usage };
const REPORT = { diagnosis: 'Magnesium deficiency, early', severity: 'medium', healthScore: 62, healthLabel: 'Average', growthStage: 'Vegetative', confidence: 80, topAction: 'Check runoff pH before feeding.', fixSteps: ['Test runoff pH', 'Add Cal-Mag at the next feed'], preventionTips: ['Keep pH steady'], environmentSummary: 'Light looks even.', targets: { ph: '6.2 to 6.8', ec: '1.4', vpd: '1.0 kPa', temp: '78F', rh: '60%' }, recheck: 'Take the same leaf again in 3 days.' };

type Handler = (body: Record<string, unknown>) => { status?: number; body: unknown };
type Options = { signedIn?: boolean; webPro: Handler; auth?: (url: URL) => { status: number; body: unknown } };

async function mock(page: Page, { signedIn, webPro, auth }: Options) {
  const calls: { path: string; method: string; body: Record<string, unknown> | null }[] = [];
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && /Content Security Policy|hydrat|Minified React|Warning:/i.test(m.text())) errors.push(m.text()); });
  await page.route(/gptengineer|googletagmanager|t\.whop\.tw|va\.vercel|_vercel/, (r) => r.abort());
  await page.route(/whop\.com/, (r) => r.abort());
  await page.route('https://vofwdhlwsahwxecewyek.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    let body: Record<string, unknown> | null = null;
    try { body = request.postDataJSON(); } catch { body = null; }
    calls.push({ path: url.pathname, method: request.method(), body });
    const json = (status: number, value: unknown) => route.fulfill({ status, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(value) });
    if (url.pathname === '/functions/v1/web-pro') { const r = webPro(body ?? {}); return json(r.status ?? 200, r.body); }
    if (url.pathname === '/functions/v1/delete-account') return json(200, { ok: true });
    if (url.pathname.startsWith('/auth/v1/')) {
      if (auth) { const r = auth(url); return json(r.status, r.body); }
      if (url.pathname.endsWith('/user')) return json(200, USER);
      if (url.pathname.endsWith('/logout')) return route.fulfill({ status: 204, headers: cors });
      return json(200, session());
    }
    if (url.pathname.startsWith('/rest/v1/')) {
      if (request.method() === 'GET') return json(200, url.pathname.endsWith('/profiles') ? [{ id: USER.id }] : []);
      return json(201, []);
    }
    return json(404, {});
  });
  if (signedIn) await page.addInitScript((value) => localStorage.setItem('sb-vofwdhlwsahwxecewyek-auth-token', value), JSON.stringify(session()));
  return { calls, errors };
}

for (const size of [{ name: 'phone', viewport: { width: 375, height: 812 } }, { name: 'desktop', viewport: { width: 1366, height: 900 } }]) {
  test.describe(size.name, () => {
    test.use({ viewport: size.viewport });

    test('price, terms, one H1, app option, and no sideways scroll', async ({ page }) => {
      const { calls, errors } = await mock(page, { webPro: () => ({ body: inactive }) });
      await page.goto('/pro');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByText('$59', { exact: true })).toBeVisible();
      await expect(page.getByText('$59 USD billed today, then $59 every year until you cancel. Cancel anytime.')).toBeVisible();
      await page.getByRole('button', { name: /^Monthly/ }).click();
      await expect(page.getByText('$19 USD billed today, then $19 every month until you cancel. Cancel anytime.')).toBeVisible();
      await expect(page.locator('#account a[href*="apps.apple.com"]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      expect(await page.locator('body').innerText()).not.toMatch(/—|unlimited|gemini|openai|stripe/i);
      expect(calls).toEqual([]); // no account code or requests until someone asks for it
      expect(errors).toEqual([]);
      await page.screenshot({ path: `output/web-pro-${size.name}.png`, fullPage: true });
    });

    test('email sign up leads to checkout for the chosen plan', async ({ page }) => {
      const { calls, errors } = await mock(page, { webPro: () => ({ body: inactive }) });
      await page.goto('/pro');
      await page.getByRole('button', { name: /^Monthly/ }).click();
      await page.getByRole('button', { name: 'Start Web Pro' }).first().click();
      await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Continue with Apple' })).toHaveCount(0);
      await expect(page.getByText('Always sign in with the same method you used when subscribing')).toBeVisible();
      await page.getByPlaceholder('Email address').fill('grower@example.test');
      await page.getByPlaceholder('Create a password').fill('short');
      await page.getByRole('button', { name: 'Create account and continue' }).click();
      await expect(page.getByText('at least 8 characters')).toBeVisible();
      await page.getByPlaceholder('Create a password').fill('long-enough-1');
      await page.screenshot({ path: `output/web-pro-signin-${size.name}.png` });
      await page.getByRole('button', { name: 'Create account and continue' }).click();
      await expect(page.getByRole('heading', { name: 'Start Web Pro' })).toBeVisible();
      await expect(page.getByText('$19 USD billed today')).toBeVisible();
      expect(calls.some((c) => c.path === '/rest/v1/profiles' && c.method === 'POST' && c.body?.id === USER.id)).toBe(true);
      expect(errors).toEqual([]);
    });

    test('subscriber workspace: report, tabs, account', async ({ page }) => {
      const { errors, calls } = await mock(page, { signedIn: true, webPro: (b) => b.action === 'diagnose' ? { body: { report: REPORT, id: 'r1', saved: true, usage: { used: 4, limit: 40 } } } : { body: activeAccess } });
      await page.goto('/pro');
      await expect(page.getByRole('heading', { name: 'Your Web Pro workspace' })).toBeVisible();
      await expect(page.getByText('37 of 40 photo reports left this week')).toBeVisible();
      await page.locator('input[type=file]').setInputFiles('public/images/grow/cannabis-leaf-yellowing-brown-spots.webp');
      await page.getByRole('button', { name: 'Get my plant report' }).click();
      await expect(page.getByRole('heading', { name: 'Magnesium deficiency, early' })).toBeVisible();
      await expect(page.getByText('36 of 40')).toBeVisible();
      const sent = calls.find((c) => c.body?.action === 'diagnose')?.body as { image: string; thumbnail: string };
      expect(sent.image).toMatch(/^data:image\/jpeg;base64,/);
      expect(sent.image.length).toBeLessThan(6_000_000);
      expect(sent.thumbnail.length).toBeLessThan(60_000);
      await page.screenshot({ path: `output/web-pro-workspace-${size.name}.png`, fullPage: true });
      for (const tab of ['My reports', 'Grow numbers', 'Checklists', 'Account']) await page.getByRole('button', { name: tab, exact: true }).click();
      await expect(page.getByRole('link', { name: /Manage or cancel/ })).toHaveAttribute('href', 'https://whop.com/billing/manage/mber_1/');
      await expect(page.getByText('Cancel your subscription first')).toBeVisible();
      await page.getByRole('button', { name: 'Grow numbers', exact: true }).click();
      await expect(page.getByText('0.87 kPa')).toBeVisible();
      await page.getByRole('button', { name: 'Save VPD reading' }).click();
      await expect.poll(() => calls.some((c) => c.path === '/rest/v1/journal_logs' && c.method === 'POST')).toBe(true);
      await page.getByRole('button', { name: 'Checklists', exact: true }).click();
      await page.getByRole('button', { name: /Weekly check/ }).click();
      await expect.poll(() => calls.some((c) => c.path === '/rest/v1/tasks' && c.method === 'POST')).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  });
}

test('returning from payment unlocks and cleans the address bar', async ({ page }) => {
  let claims = 0;
  await mock(page, { signedIn: true, webPro: (b) => b.action === 'claim' ? (claims += 1) < 2 ? { status: 409, body: { error: 'Your payment is still processing.', code: 'payment_pending' } } : { body: activeAccess } : { body: inactive } });
  await page.goto('/pro?payment=pay_abc12345&status=succeeded');
  await expect(page.getByRole('heading', { name: 'Your Web Pro workspace' })).toBeVisible();
  expect(claims).toBe(2);
  expect(page.url()).not.toContain('payment=');
});

test('a declined payment returns to checkout and claims nothing', async ({ page }) => {
  const { calls } = await mock(page, { signedIn: true, webPro: () => ({ body: inactive }) });
  await page.goto('/pro?payment=pay_abc12345&status=failed');
  await expect(page.getByText('That payment was not completed')).toBeVisible();
  expect(calls.some((c) => c.body?.action === 'claim')).toBe(false);
});

test('a payment stuck in processing never shows a second payment form', async ({ page }) => {
  test.setTimeout(120_000);
  await mock(page, { signedIn: true, webPro: (b) => b.action === 'claim' ? { status: 409, body: { error: 'Your payment is still processing.', code: 'payment_pending' } } : { body: inactive } });
  await page.goto('/pro?payment=pay_abc12345&status=succeeded');
  await expect(page.getByRole('heading', { name: 'Your payment is being confirmed' })).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText('You do not need to pay again.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start Web Pro' })).toHaveCount(0);
});

test('checkout stays closed if the subscription service is down', async ({ page }) => {
  await mock(page, { signedIn: true, webPro: () => ({ status: 503, body: { error: 'Subscription checks are not set up yet.', code: 'not_configured' } }) });
  await page.goto('/pro');
  await expect(page.getByText('Checkout stays closed until this works')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start Web Pro' })).toHaveCount(0);
});

test('wrong password and existing account give clear help', async ({ page }) => {
  await mock(page, { webPro: () => ({ body: inactive }), auth: (url) => url.pathname.endsWith('/signup') ? { status: 422, body: { code: 'user_already_exists', error_code: 'user_already_exists', msg: 'User already registered' } } : { status: 400, body: { code: 'invalid_credentials', error_code: 'invalid_credentials', msg: 'Invalid login credentials' } } });
  await page.goto('/pro#account');
  await page.getByPlaceholder('Email address').fill('grower@example.test');
  await page.getByPlaceholder('Create a password').fill('long-enough-1');
  await page.getByRole('button', { name: 'Create account and continue' }).click();
  await expect(page.getByText('That email already has an account')).toBeVisible();
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByPlaceholder('Password').fill('wrong-password');
  await page.locator('form').getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('That email and password do not match')).toBeVisible();
});

test('Google sign-in asks for the exact callback with PKCE', async ({ page }) => {
  await mock(page, { webPro: () => ({ body: inactive }) });
  let authorize: URL | null = null;
  await page.route('**/auth/v1/authorize**', (r) => { authorize = new URL(r.request().url()); return r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }); });
  await page.goto('/pro#account');
  await page.getByRole('button', { name: 'Continue with Google' }).click();
  await expect.poll(() => authorize?.searchParams.get('provider')).toBe('google');
  expect(authorize!.searchParams.get('redirect_to')).toMatch(/\/auth\/callback$/);
  expect(authorize!.searchParams.get('code_challenge')).toBeTruthy();
});

test('the sign-in callback recovers from a cancelled sign-in', async ({ page }) => {
  await mock(page, { webPro: () => ({ body: inactive }) });
  await page.goto('/auth/callback?error=access_denied&error_description=cancelled');
  await expect(page.getByRole('heading', { name: 'Sign in was not completed' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to Web Pro' }).click();
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
});

test('the sign-in callback exchanges the code once and opens the account', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sb-vofwdhlwsahwxecewyek-auth-token-code-verifier', JSON.stringify('verifier')));
  const { calls, errors } = await mock(page, { webPro: () => ({ body: inactive }) });
  await page.goto('/auth/callback?code=abc123');
  await expect(page.getByRole('heading', { name: 'Start Web Pro' })).toBeVisible();
  expect(calls.filter((c) => c.path === '/auth/v1/token').length).toBe(1);
  expect(errors).toEqual([]);
});

test('the symptom checker keeps the app first; Web Pro shows on desktop only', async ({ page }) => {
  await mock(page, { webPro: () => ({ body: inactive }) });
  const invite = page.locator('a[data-cta-location="symptom-checker-results:web-pro"]');
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/cannabis-symptom-checker');
  await page.getByRole('button', { name: /example leaf/i }).first().click();
  await expect(invite).toBeVisible();
  const app = await page.locator('a[data-cta-location="symptom-checker-results:ios"]').boundingBox();
  expect((await invite.boundingBox())!.y).toBeGreaterThan(app!.y + app!.height);
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(invite).toBeHidden();
  await expect(page.locator('a[data-cta-location="symptom-checker-results:ios"]')).toBeVisible();
});
