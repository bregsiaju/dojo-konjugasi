import { FORMS } from '../data/forms';
import { WORDS } from '../data/words';
import type { FormId, Settings, Word } from '../types';
import { applies, typeKey, WORD_BY_ID } from './conjugate';
import { pickRandom } from './util';

/** Satu kombinasi kata × bentuk dalam jadwal pengulangan. */
export interface SrsEntry {
  /** kotak Leitner (0 = baru, makin tinggi makin dikuasai) */
  b: number;
  c: number;
  w: number;
  due: number;
}
export type SrsMap = Record<string, SrsEntry>;

export interface PoolItem {
  w: Word;
  f: FormId;
  key: string;
}
export type ItemStatus = 'Baru' | 'Ulangan' | 'Lemah';
export interface PickedItem extends PoolItem {
  status?: ItemStatus;
}

/** Jeda per kotak: 1 mnt, 5 mnt, 30 mnt, 4 jam, 1 hari, 3 hari, 8 hari, 21 hari */
export const INTERVALS = [0, 60e3, 5 * 60e3, 30 * 60e3, 4 * 3600e3, 86400e3, 3 * 86400e3, 8 * 86400e3, 21 * 86400e3];
/** Jawaban salah dijadwalkan ulang setelah ini */
export const RETRY_MS = 45e3;
/** Kotak minimal untuk dianggap "dikuasai" */
export const MASTERED_BOX = 5;

export const itemKey = (w: Word, f: FormId) => w.k + '|' + f;

export function parseKey(key: string): PoolItem | null {
  const i = key.lastIndexOf('|');
  const w = WORD_BY_ID[key.slice(0, i)];
  const f = key.slice(i + 1) as FormId;
  return w && applies(w, f) ? { w, f, key } : null;
}

export function gradeEntry(prev: SrsEntry | undefined, ok: boolean, now = Date.now()): SrsEntry {
  const e = prev ? { ...prev } : { b: 0, c: 0, w: 0, due: 0 };
  if (ok) {
    e.b = Math.min(e.b + 1, INTERVALS.length - 1);
    e.c++;
    e.due = now + INTERVALS[e.b];
  } else {
    e.b = 1;
    e.w++;
    e.due = now + RETRY_MS;
  }
  return e;
}

export const accuracy = (e?: SrsEntry) => (e ? e.c / Math.max(1, e.c + e.w) : 1);

/** Semua kombinasi kata × bentuk yang aktif menurut pengaturan. */
export function buildPool(settings: Settings): PoolItem[] {
  const pool: PoolItem[] = [];
  for (const w of WORDS) {
    if (!settings.levels[w.lv] || !settings.types[typeKey(w)]) continue;
    for (const F of FORMS) {
      if (settings.forms[F.id] && applies(w, F.id)) pool.push({ w, f: F.id, key: itemKey(w, F.id) });
    }
  }
  return pool;
}

/**
 * Pilih soal berikutnya:
 * - mode "fokus kelemahan": ambil dari yang akurasinya paling rendah
 * - selain itu 75% soal yang jatuh tempo (kotak terendah dulu), sisanya soal baru
 * - hindari soal yang baru saja muncul
 */
export function pickItem(
  pool: PoolItem[],
  srs: SrsMap,
  recent: string[],
  weakOnly: boolean,
  now = Date.now(),
  rnd = Math.random,
): PickedItem | null {
  if (!pool.length) return null;
  const avail = pool.filter((it) => !recent.includes(it.key));
  const P = avail.length ? avail : pool;

  if (weakOnly) {
    const weak = P.filter((it) => (srs[it.key]?.w ?? 0) > 0).sort((a, b) => accuracy(srs[a.key]) - accuracy(srs[b.key]));
    if (weak.length) return { ...pickRandom(weak.slice(0, 10), rnd), status: 'Lemah' };
  }

  const due = P.filter((it) => srs[it.key] && srs[it.key].due <= now);
  const fresh = P.filter((it) => !srs[it.key]);
  if (due.length && (rnd() < 0.75 || !fresh.length)) {
    due.sort((a, b) => srs[a.key].b - srs[b.key].b || srs[a.key].due - srs[b.key].due);
    return { ...pickRandom(due.slice(0, 6), rnd), status: 'Ulangan' };
  }
  if (fresh.length) return { ...pickRandom(fresh, rnd), status: 'Baru' };

  const next = P.slice().sort((a, b) => srs[a.key].due - srs[b.key].due)[0];
  return { ...next, status: 'Ulangan' };
}

export function formatInterval(ms: number): string {
  if (ms < 3600e3) return Math.round(ms / 60e3) + ' menit lagi';
  if (ms < 86400e3) return Math.round(ms / 3600e3) + ' jam lagi';
  return Math.round(ms / 86400e3) + ' hari lagi';
}
