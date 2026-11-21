import { PASSIVE } from '../data/passive';
import type { AdjFormId, FormId, KeigoFormId, VerbFormId, Word } from '../types';
import { isVerb } from './conjugate';

/**
 * Arti dasar tanpa keterangan dalam kurung, beberapa makna digabung pakai "/":
 * "tinggi, mahal" → "tinggi/mahal", "dingin (disentuh)" → "dingin".
 * (Arti lengkap dengan keterangannya tetap tampil di soal.)
 */
const base = (w: Word) => w.m.replace(/\s*\([^)]*\)/g, '').replace(/, /g, '/');

/** Kata dasar untuk bentuk perintah: "ditulis" → "tulis", "didengar / ditanya" → "dengar/tanya" */
function imperativeBase(w: Word): string {
  const pas = PASSIVE[w.k];
  if (pas && w.m.startsWith('me')) {
    const parts = pas.split(' / ');
    if (parts.every((p) => p.startsWith('di'))) return parts.map((p) => p.slice(2)).join('/');
  }
  return base(w);
}

const VERB: Record<VerbFormId | KeigoFormId, (b: string, w: Word) => string> = {
  masu: (b) => `${b} (sopan)`,
  masu_neg: (b) => `tidak ${b} (sopan)`,
  masu_past: (b) => `sudah ${b} (sopan)`,
  masu_past_neg: (b) => `dulu tidak ${b} (sopan)`,
  nai: (b) => `tidak ${b}`,
  ta: (b) => `sudah ${b}`,
  nakatta: (b) => `dulu tidak ${b}`,
  te: (b) => `${b}, lalu …`,
  naide: (b) => `tanpa ${b}; jangan ${b}`,
  tai: (b) => `ingin ${b}`,
  tari: (b) => `${b}, dan sebagainya`,
  tara: (b) => `kalau / setelah ${b}`,
  nagara: (b) => `sambil ${b}`,
  sou: (b) => `kelihatannya akan ${b}`,
  potential: (b) => `bisa ${b}`,
  passive: (b, w) => PASSIVE[w.k] ?? `terganggu karena ada yang ${b} (pasif penderita)`,
  causative: (b) => `menyuruh / membiarkan ${b}`,
  cpass: (b) => `dipaksa ${b}`,
  volitional: (b) => `ayo ${b}; berniat ${b}`,
  imperative: (_b, w) => `${imperativeBase(w)}!`,
  prohibitive: (b) => `jangan ${b}!`,
  ba: (b) => `kalau ${b}`,
  zuni: (b) => `tanpa ${b}`,
  sonkei: (b) => `${b} (hormat)`,
  kenjou: (b) => `${b} (merendah)`,
};

const ADJ: Record<AdjFormId, (b: string, w: Word) => string> = {
  a_neg: (b) => `tidak ${b}`,
  a_past: (b) => `(waktu itu) ${b}`,
  a_pastneg: (b) => `(waktu itu) tidak ${b}`,
  a_polneg: (b) => `tidak ${b} (sopan)`,
  a_te: (b) => `${b} dan …; karena ${b}, …`,
  a_adv: (b) => `dengan ${b}; menjadi ${b} (+ なる)`,
  a_pre: (b) => `… yang ${b}`,
  a_ba: (b) => `kalau ${b}`,
  a_tara: (b) => `kalau ${b}`,
  a_sou: (b) => `kelihatannya ${b}`,
  // "tinggi/mahal" → "tingginya/mahalnya"
  a_sa: (b) => b.split('/').map((s) => s + 'nya').join('/') + ' (tingkat/ukuran)',
};

/** Arti kata w dalam bentuk f, mis. 冷たい + ～くて → "dingin dan …; karena dingin, …" */
export function gloss(w: Word, f: FormId): string {
  const b = base(w);
  if (isVerb(w)) return VERB[f as VerbFormId | KeigoFormId](b, w);
  return ADJ[f as AdjFormId](b, w);
}
