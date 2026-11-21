import { FORMS } from '../data/forms';
import type { SrsMap } from '../lib/srs';
import type { Settings } from '../types';

/** Kunci yang sama dengan versi satu-file sebelumnya, jadi formatnya tetap kompatibel. */
const STORE_KEY = 'dojo-konjugasi-v1';

export interface DayStats {
  d: string;
  c: number;
  n: number;
}
export interface ReverseStats {
  c: number;
  n: number;
}
export interface Persisted {
  settings: Settings;
  srs: SrsMap;
  day: DayStats;
  revs: ReverseStats;
}

export function defaultSettings(): Settings {
  return {
    levels: { 5: true, 4: true, 3: true },
    types: { g: true, i: true, irr: true, ia: true, na: true },
    forms: Object.fromEntries(FORMS.map((f) => [f.id, true])) as Settings['forms'],
    furigana: true,
    pattern: true,
    showGroup: false,
    romaji: true,
    weak: false,
  };
}

export function load(): Persisted {
  const base = defaultSettings();
  const empty: Persisted = { settings: base, srs: {}, day: { d: '', c: 0, n: 0 }, revs: { c: 0, n: 0 } };
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null') as Partial<Persisted> | null;
    if (!raw) return empty;
    const s = raw.settings ?? ({} as Partial<Settings>);
    return {
      // gabungkan dengan default supaya bentuk/opsi baru otomatis aktif
      settings: {
        ...base,
        ...s,
        levels: { ...base.levels, ...s.levels },
        types: { ...base.types, ...s.types },
        forms: { ...base.forms, ...s.forms },
      },
      srs: raw.srs ?? {},
      day: raw.day ?? empty.day,
      revs: raw.revs ?? empty.revs,
    };
  } catch {
    return empty;
  }
}

export function save(data: Persisted): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    // penyimpanan penuh atau diblokir (mode privat): abaikan, aplikasi tetap jalan
  }
}
