/// <reference lib="deno.ns" />
// MasterGrowbot Web Pro: subscription checks (Whop) and photo reports for www.mastergrowbot.com.
//
// This is a NEW, separate function. It does not change gemini-v3 or any function the mobile apps
// use: photo reports are forwarded to gemini-v3 with the buyer's own session, so the existing usage
// metering and cost caps keep applying. Deploy with JWT verification ON.
//
// Secrets: WHOP_API_KEY (already set for whop-activate-tokens) and WHOP_WEB_PRO_PRODUCT_ID (prod_...).

import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import {
  buyerOf, buildPrompt, checkPayment, membershipIsActive, parseReport, periodEndOf, planOf,
  safeManageUrl, validImage, validThumbnail, WEEKLY_PHOTO_REPORTS,
} from './access.ts';

type Json = Record<string, unknown>;

const WHOP_API = 'https://api.whop.com/api/v1';
const ORIGINS = new Set(['https://www.mastergrowbot.com', 'https://mastergrowbot.com', 'http://localhost:8080', 'http://127.0.0.1:8080']);

class ApiError extends Error {
  constructor(message: string, public status = 400, public code = 'request_failed') { super(message); }
}

function cors(req: Request) {
  const origin = req.headers.get('Origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ORIGINS.has(origin) ? origin : 'https://www.mastergrowbot.com',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

async function whop(path: string): Promise<Json | null> {
  const key = Deno.env.get('WHOP_API_KEY');
  if (!key) throw new ApiError('Subscription checks are not set up yet.', 503, 'not_configured');
  let res: Response;
  try {
    res = await fetch(`${WHOP_API}${path}`, {
      headers: { Authorization: `Bearer ${key}`, Accept: 'application/json', 'Api-Version-Date': '2026-11-17-2' },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new ApiError('We could not reach the subscription service. Please try again.', 503, 'whop_unavailable');
  }
  if (res.status === 404) return null;
  if (!res.ok) {
    console.error('web-pro whop error', { status: res.status, path: path.split('?')[0].replace(/(pay|mem)_\w+/, '$1') });
    throw new ApiError('We could not check your subscription right now. Please try again.', 503, 'whop_unavailable');
  }
  return await res.json().catch(() => null) as Json | null;
}

const productId = () => {
  const id = Deno.env.get('WHOP_WEB_PRO_PRODUCT_ID');
  if (!id) throw new ApiError('Subscription checks are not set up yet.', 503, 'not_configured');
  return id;
};

Deno.serve(async (req) => {
  const headers = cors(req);
  const reply = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);

  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authorization = req.headers.get('Authorization') ?? '';
    const client = createClient(url, anonKey, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false, autoRefreshToken: false } });
    const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });

    // The account always comes from the verified session, never from the request body.
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) throw new ApiError('Please sign in again.', 401, 'invalid_session');
    if (user.is_anonymous) throw new ApiError('Please sign in with Google, Apple or email.', 403, 'account_required');

    const body = await req.json().catch(() => null) as Json | null;
    const action = body?.action;
    const product = productId();

    const linkedMembership = () => {
      const link = (user.app_metadata as Json | undefined)?.web_pro as Json | undefined;
      return typeof link?.membership_id === 'string' && /^mem_\w+$/.test(link.membership_id) ? link.membership_id : null;
    };

    // app_metadata can only be written with the service role, so a visitor cannot grant access.
    const link = async (membershipId: string, paymentId: string) => {
      const { error } = await admin.auth.admin.updateUserById(user.id, {
        app_metadata: { web_pro: { membership_id: membershipId, payment_id: paymentId, linked_at: new Date().toISOString() } },
      });
      if (error) throw new ApiError('Your payment is safe, but we could not finish unlocking. Please try again.', 503, 'link_failed');
    };

    const activeMembership = async (id: string) => {
      const membership = await whop(`/memberships/${id}`);
      return membership && membershipIsActive(membership, product, Date.now()) ? membership : null;
    };

    /** Finds a paid checkout made by this account whose browser closed before it could be confirmed. */
    const recover = async (pages: number) => {
      let after = '';
      for (let page = 0; page < pages; page += 1) {
        const query = new URLSearchParams({ product_id: product, status: 'paid', first: '100', order: 'created_at', direction: 'desc' });
        const account = Deno.env.get('WHOP_COMPANY_ID');
        if (account) query.set('account_id', account);
        if (after) query.set('after', after);
        const result = await whop(`/payments?${query}`);
        for (const payment of (Array.isArray(result?.data) ? result.data : []) as Json[]) {
          if (buyerOf(payment) !== user.id) continue;
          const checked = checkPayment(payment, user.id, product);
          if (!checked.ok) continue;
          const membership = await activeMembership(checked.membershipId);
          if (!membership) continue;
          await link(checked.membershipId, String(payment.id));
          return membership;
        }
        const info = result?.page_info as Json | undefined;
        if (!info?.has_next_page || typeof info.end_cursor !== 'string') return null;
        after = info.end_cursor;
      }
      return null;
    };

    const currentMembership = async (pages: number) => {
      const id = linkedMembership();
      const linked = id ? await activeMembership(id) : null;
      return linked ?? await recover(pages);
    };

    const usedThisWeek = async () => {
      const since = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
      const { data, error } = await admin.from('user_daily_usage').select('request_count').eq('user_id', user.id).gte('date', since);
      if (error) throw new ApiError('Usage is temporarily unavailable. Please try again.', 503, 'usage_unavailable');
      return (data ?? []).reduce((sum: number, row: { request_count: number | null }) => sum + (row.request_count ?? 0), 0);
    };

    const summary = async (membership: Json | null) => ({
      active: Boolean(membership),
      planId: membership ? planOf(membership) : null,
      status: membership ? String(membership.status) : null,
      renewsAt: membership ? (periodEndOf(membership) ? new Date(periodEndOf(membership)!).toISOString() : null) : null,
      cancelAtPeriodEnd: membership ? membership.cancel_at_period_end === true : false,
      manageUrl: membership ? safeManageUrl(membership.manage_url) : null,
      usage: { used: membership ? await usedThisWeek() : 0, limit: WEEKLY_PHOTO_REPORTS },
    });

    if (action === 'status') return reply(await summary(await currentMembership(1)));
    if (action === 'restore') return reply(await summary(await currentMembership(5)));

    if (action === 'claim') {
      const paymentId = body?.paymentId;
      if (typeof paymentId !== 'string' || !/^pay_\w{4,80}$/.test(paymentId)) throw new ApiError('That payment could not be found.', 400, 'payment_mismatch');
      const payment = await whop(`/payments/${paymentId}`);
      if (!payment) throw new ApiError('Your payment is still processing.', 409, 'payment_pending');
      const checked = checkPayment(payment, user.id, product);
      if (!checked.ok) {
        if (checked.code === 'payment_pending') throw new ApiError('Your payment is still processing.', 409, 'payment_pending');
        if (checked.code === 'payment_not_paid') throw new ApiError('That payment was not completed.', 402, 'payment_not_paid');
        throw new ApiError('That payment belongs to a different sign-in. Use the same sign-in you used at checkout.', 403, 'payment_mismatch');
      }
      const membership = await whop(`/memberships/${checked.membershipId}`);
      if (!membership) throw new ApiError('Your payment is still processing.', 409, 'payment_pending');
      if (!membershipIsActive(membership, product, Date.now())) {
        if (['canceled', 'expired', 'completed'].includes(String(membership.status))) {
          throw new ApiError('That subscription has ended. You can start a new one below.', 410, 'membership_ended');
        }
        throw new ApiError('Your payment is still processing.', 409, 'payment_pending');
      }
      await link(checked.membershipId, paymentId);
      return reply(await summary(membership));
    }

    if (action === 'diagnose') {
      if (!await currentMembership(1)) throw new ApiError('Web Pro is required for photo reports.', 403, 'web_pro_required');
      if (!validImage(body?.image)) throw new ApiError('Choose a JPEG, PNG or WebP photo.', 400, 'invalid_image');
      const used = await usedThisWeek();
      if (used >= WEEKLY_PHOTO_REPORTS) throw new ApiError(`You have used your ${WEEKLY_PHOTO_REPORTS} photo reports for this week. More open up over the next few days.`, 429, 'weekly_limit');

      let aiResponse: Response;
      try {
        aiResponse = await fetch(`${url}/functions/v1/gemini-v3`, {
          method: 'POST',
          headers: { Authorization: authorization, apikey: anonKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'diagnosis', image: body!.image, prompt: buildPrompt(body!) }),
          signal: AbortSignal.timeout(105000),
        });
      } catch {
        throw new ApiError('The report took too long. Please try again.', 504, 'timeout');
      }
      const ai = await aiResponse.json().catch(() => null) as Json | null;
      if (aiResponse.status === 429) throw new ApiError('You have reached this week\'s photo report limit. More open up over the next few days.', 429, 'weekly_limit');
      if (!aiResponse.ok) throw new ApiError('The report could not be created. Please try again in a minute.', 502, 'report_failed');
      const report = parseReport(typeof ai?.result === 'string' ? ai.result : '');
      if (!report) throw new ApiError('The photo could not be read clearly. Try a sharper, closer photo in white light.', 502, 'report_unreadable');

      // Saved with the grower's own session, so the existing row rules apply unchanged.
      const thumbnail = validThumbnail(body?.thumbnail);
      let id: string | null = null;
      const { error: profileError } = await client.from('profiles').upsert({ id: user.id, email: user.email ?? null }, { onConflict: 'id', ignoreDuplicates: true });
      if (!profileError) {
        const { data } = await client.from('diagnosis_reports')
          .insert({ user_id: user.id, plant_id: null, image_url: null, confidence_score: report.confidence, diagnosis_json: { ...report, source: 'web-pro', ...(thumbnail ? { thumbnail } : {}) } })
          .select('id').maybeSingle();
        id = (data as { id?: string } | null)?.id ?? null;
      }
      return reply({ report, id, saved: Boolean(id), usage: { used: used + 1, limit: WEEKLY_PHOTO_REPORTS } });
    }

    throw new ApiError('Unknown action', 400);
  } catch (error) {
    const known = error instanceof ApiError;
    if (!known) console.error('web-pro unexpected error');
    return reply(
      { error: known ? error.message : 'Something went wrong. Please try again.', code: known ? error.code : 'request_failed' },
      known ? error.status : 500,
    );
  }
});
