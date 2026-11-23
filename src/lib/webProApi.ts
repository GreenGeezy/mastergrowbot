import { supabase } from '@/lib/supabase';

export type Access = {
  active: boolean;
  planId: string | null;
  status: string | null;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  manageUrl: string | null;
  usage: { used: number; limit: number };
};

export type WebReport = {
  diagnosis: string;
  severity: 'low' | 'medium' | 'high';
  healthScore: number;
  healthLabel: string;
  growthStage: string;
  confidence: number;
  topAction: string;
  fixSteps: string[];
  preventionTips: string[];
  environmentSummary: string;
  targets: { ph: string; ec: string; vpd: string; temp: string; rh: string };
  recheck: string;
};

export type SavedReport = { id: string; createdAt: string; report: WebReport; thumbnail: string | null };
export type CalcKind = 'vpd' | 'light' | 'week';
export type SavedCalc = { id: string; createdAt: string; kind: CalcKind; content: string };
export type ChecklistItem = { id: number; title: string; done: boolean };

export class WebProError extends Error {
  code: string;
  constructor(message: string, code = 'request_failed') {
    super(message);
    this.code = code;
  }
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('web-pro', { body });
  if (!error) return data as T;
  const context = (error as { context?: unknown }).context;
  if (context instanceof Response) {
    const payload = await context.clone().json().catch(() => null) as { error?: string; code?: string } | null;
    if (payload?.error) throw new WebProError(payload.error, payload.code);
    throw new WebProError('This service is temporarily unavailable. Please try again in a few minutes.', 'unavailable');
  }
  throw new WebProError('The connection dropped. Check your internet and try again.', 'network');
}

export const getAccess = () => call<Access>({ action: 'status' });
export const restoreAccess = () => call<Access>({ action: 'restore' });

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const RETRYABLE = new Set(['payment_pending', 'network', 'whop_unavailable', 'link_failed', 'unavailable']);

/** Whop can take a few seconds to mark a new payment as paid, so pending answers are retried. */
export async function claimPayment(paymentId: string): Promise<Access> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await call<Access>({ action: 'claim', paymentId });
    } catch (error) {
      const code = error instanceof WebProError ? error.code : '';
      if (!RETRYABLE.has(code) || attempt >= 6) throw error;
      await wait(2000 + attempt * 1000);
    }
  }
}

export const diagnose = (input: { image: string; thumbnail: string | null; stage: string; method: string; strain: string; notes: string }) =>
  call<{ report: WebReport; id: string | null; saved: boolean; usage: Access['usage'] }>({ action: 'diagnose', ...input });

const loadError = () => new WebProError('Your saved items could not be loaded. Please try again.');
const saveError = () => new WebProError('That could not be saved. Please try again.');

export async function listReports(userId: string): Promise<SavedReport[]> {
  const { data, error } = await supabase.from('diagnosis_reports')
    .select('id, created_at, diagnosis_json').eq('user_id', userId)
    .order('created_at', { ascending: false }).limit(60);
  if (error) throw loadError();
  return (data ?? []).flatMap((row) => {
    const json = row.diagnosis_json as (WebReport & { source?: string; thumbnail?: string }) | null;
    if (!json || json.source !== 'web-pro') return [];
    const { thumbnail, ...report } = json;
    return [{ id: String(row.id), createdAt: String(row.created_at), report, thumbnail: thumbnail ?? null }];
  });
}

export async function deleteReport(userId: string, id: string): Promise<void> {
  const { error } = await supabase.from('diagnosis_reports').delete().eq('id', id).eq('user_id', userId);
  if (error) throw saveError();
}

export async function listCalcs(userId: string): Promise<SavedCalc[]> {
  const { data, error } = await supabase.from('journal_logs')
    .select('id, created_at, content, tags').eq('user_id', userId).contains('tags', ['web-pro'])
    .order('created_at', { ascending: false }).limit(60);
  if (error) throw loadError();
  return (data ?? []).map((row) => {
    const tags = (row.tags as string[] | null) ?? [];
    const kind: CalcKind = tags.includes('light') ? 'light' : tags.includes('week') ? 'week' : 'vpd';
    return { id: String(row.id), createdAt: String(row.created_at), content: String(row.content ?? ''), kind };
  });
}

export async function saveCalc(userId: string, kind: CalcKind, content: string, values: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from('journal_logs').insert({
    user_id: userId, entry_type: 'note', content, tags: ['web-pro', kind], ai_analysis: { source: 'web-pro', kind, values },
  });
  if (error) throw saveError();
}

export async function deleteCalc(userId: string, id: string): Promise<void> {
  const { error } = await supabase.from('journal_logs').delete().eq('id', id).eq('user_id', userId);
  if (error) throw saveError();
}

export async function listChecklist(userId: string): Promise<ChecklistItem[]> {
  const { data, error } = await supabase.from('tasks')
    .select('id, title, is_completed').eq('user_id', userId).eq('source', 'web-pro')
    .order('id', { ascending: true }).limit(200);
  if (error) throw loadError();
  return (data ?? []).map((row) => ({ id: Number(row.id), title: String(row.title ?? ''), done: Boolean(row.is_completed) }));
}

export async function addChecklist(userId: string, titles: string[]): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabase.from('tasks').insert(titles.map((title) => ({
    user_id: userId, plant_id: null, title, is_completed: false, due_date: now.slice(0, 10),
    source: 'web-pro', type: 'other', recurrence: null, notes: null, created_at: now,
  })));
  if (error) throw saveError();
}

export async function setChecklistDone(userId: string, id: number, done: boolean): Promise<void> {
  const { error } = await supabase.from('tasks').update({ is_completed: done }).eq('id', id).eq('user_id', userId);
  if (error) throw saveError();
}

export async function clearChecklist(userId: string, ids: number[]): Promise<void> {
  if (!ids.length) return;
  const { error } = await supabase.from('tasks').delete().in('id', ids).eq('user_id', userId);
  if (error) throw saveError();
}
