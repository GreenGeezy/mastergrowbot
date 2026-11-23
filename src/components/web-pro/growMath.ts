// Same formulas and stage targets as the free VPD and grow light calculators.
const fToC = (f: number) => ((f - 32) * 5) / 9;
const svp = (c: number) => 0.61078 * Math.exp((17.27 * c) / (c + 237.3));

export const VPD_STAGES = {
  clones: { label: 'Clones', min: 0.3, max: 0.6 },
  seedling: { label: 'Seedling', min: 0.4, max: 0.8 },
  vegetative: { label: 'Vegetative', min: 0.8, max: 1.2 },
  earlyFlower: { label: 'Early flower', min: 1.0, max: 1.3 },
  lateFlower: { label: 'Late flower', min: 1.2, max: 1.6 },
} as const;
export type VpdStage = keyof typeof VPD_STAGES;

export const LEAF_OFFSETS = { led: { label: 'LED', offset: -4 }, hps: { label: 'HPS', offset: 5 } } as const;
export type LeafLight = keyof typeof LEAF_OFFSETS;

export function leafVpd(airTempF: number, rh: number, leafOffsetF: number) {
  const air = fToC(airTempF);
  return Math.max(0, svp(air + (leafOffsetF * 5) / 9) - svp(air) * (rh / 100));
}

export const LIGHT_STAGES = {
  seedling: { label: 'Seedlings and clones', min: 10, max: 20 },
  vegetative: { label: 'Vegetative', min: 25, max: 40 },
  flower: { label: 'Flower', min: 35, max: 45 },
} as const;
export type LightStage = keyof typeof LIGHT_STAGES;

export const dli = (ppfd: number, hours: number) => (ppfd * hours * 3600) / 1_000_000;

export const rangeState = (value: number, min: number, max: number): 'low' | 'ok' | 'high' =>
  value < min ? 'low' : value > max ? 'high' : 'ok';

/** Reads a number typed into a form. Returns null when it is missing or outside the sensible range. */
export function readNumber(text: string, min: number, max: number): number | null {
  if (!text.trim()) return null;
  const n = Number(text);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}
