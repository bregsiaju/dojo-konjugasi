import { FORM_BY_ID } from '../data/forms';
import { KEIGO } from '../data/keigo';
import { WORDS } from '../data/words';
import type { AdjFormId, FormId, Solution, TypeKey, VerbFormId, Word, WordFlag } from '../types';

/** Baris kana godan: あ・い・う・え・お untuk tiap akhiran */
export const ROW: Record<string, string> = {
  う: 'わいうえお', く: 'かきくけこ', ぐ: 'がぎぐげご', す: 'さしすせそ', つ: 'たちつてと',
  ぬ: 'なにぬねの', ぶ: 'ばびぶべぼ', む: 'まみむめも', る: 'らりるれろ',
};
/** Akhiran bentuk て godan */
export const TE: Record<string, string> = {
  う: 'って', つ: 'って', る: 'って', く: 'いて', ぐ: 'いで', す: 'して', ぬ: 'んで', ぶ: 'んで', む: 'んで',
};
/** Kana baris い dan え (untuk mendeteksi godan yang mirip ichidan, mis. 帰る) */
export const IE_ROW = 'いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ';

export const WORD_BY_ID: Record<string, Word> = Object.fromEntries(WORDS.map((w) => [w.k, w]));

export const isVerb = (w: Word) => w.t === 'g' || w.t === 'i' || w.t === 's' || w.t === 'k';
export const typeKey = (w: Word): TypeKey => (w.t === 's' || w.t === 'k' ? 'irr' : w.t);
export const isKeigoForm = (f: FormId): f is 'sonkei' | 'kenjou' => f === 'sonkei' || f === 'kenjou';

const BASIC: FormId[] = ['masu', 'masu_neg', 'masu_past', 'masu_past_neg', 'nai', 'ta', 'nakatta', 'te', 'naide', 'ba', 'tara', 'tari', 'nagara', 'zuni', 'sou'];
const LIMITS: Partial<Record<WordFlag, FormId[]>> = {
  lim: BASIC,
  aru: ['masu', 'masu_neg', 'masu_past', 'masu_past_neg', 'nai', 'ta', 'nakatta', 'te', 'ba', 'tara', 'tari', 'sou'],
  hon: ['masu', 'masu_neg', 'masu_past', 'masu_past_neg', 'nai', 'ta', 'nakatta', 'te', 'imperative', 'ba', 'tara'],
};

/** Bentuk-bentuk dasar kata kerja, dihitung dari string s (kanji atau kana). */
export interface Stems {
  dict: string;
  /** bentuk ます tanpa ます (連用形) */
  I: string;
  /** khusus untuk ～ます (berbeda pada kata kerja hormat: いらっしゃい～) */
  Imasu: string;
  te: string;
  ta: string;
  nai: string;
  pot: string[];
  pas: string[];
  caus: string[];
  cpass: string[];
  vol: string[];
  imp: string[];
  ba: string;
  /** akar untuk ～ずに */
  zu: string;
}

export function stems(w: Word, s: string): Stems {
  switch (w.t) {
    case 'g': {
      const b = s.slice(0, -1);
      const L = s.slice(-1);
      const row = ROW[L];
      if (!row) throw new Error(`Akhiran godan tidak dikenal: ${w.k}`);
      const A = b + row[0], I = b + row[1], E = b + row[3], O = b + row[4];
      const te = w.f === 'iku' ? b + 'って' : b + TE[L];
      const ta = te.replace(/て$/, 'た').replace(/で$/, 'だ');
      return {
        dict: s, I, Imasu: w.f === 'hon' ? b + 'い' : I, te, ta,
        nai: w.f === 'aru' ? 'ない' : A + 'ない',
        pot: [E + 'る'], pas: [A + 'れる'], caus: [A + 'せる'],
        cpass: L === 'す' ? [A + 'せられる'] : [A + 'される', A + 'せられる'],
        vol: [O + 'う'], imp: w.f === 'hon' ? [b + 'い'] : [E], ba: E + 'ば', zu: A,
      };
    }
    case 'i': {
      const b = s.slice(0, -1);
      return {
        dict: s, I: b, Imasu: b, te: b + 'て', ta: b + 'た', nai: b + 'ない',
        pot: [b + 'られる', b + 'れる'], pas: [b + 'られる'], caus: [b + 'させる'], cpass: [b + 'させられる'],
        vol: [b + 'よう'], imp: w.f === 'kureru' ? [b] : [b + 'ろ'], ba: b + 'れば', zu: b,
      };
    }
    case 's': {
      const p = s.slice(0, -2);
      return {
        dict: s, I: p + 'し', Imasu: p + 'し', te: p + 'して', ta: p + 'した', nai: p + 'しない',
        pot: [p + 'できる'], pas: [p + 'される'], caus: [p + 'させる'], cpass: [p + 'させられる'],
        vol: [p + 'しよう'], imp: [p + 'しろ', p + 'せよ'], ba: p + 'すれば', zu: p + 'せ',
      };
    }
    case 'k': {
      // 来る: kanji tetap 来, cara bacanya berubah (こ/き/く)
      const f = (x: string) => (s[0] === '来' ? '来' + x.slice(1) : x);
      return {
        dict: s, I: f('き'), Imasu: f('き'), te: f('きて'), ta: f('きた'), nai: f('こない'),
        pot: [f('こられる'), f('これる')], pas: [f('こられる')], caus: [f('こさせる')], cpass: [f('こさせられる')],
        vol: [f('こよう')], imp: [f('こい')], ba: f('くれば'), zu: f('こ'),
      };
    }
    default:
      throw new Error(`${w.k} bukan kata kerja`);
  }
}

const VERB_FORMS: Record<VerbFormId, (s: Stems) => string[]> = {
  masu: (s) => [s.Imasu + 'ます'],
  masu_neg: (s) => [s.Imasu + 'ません'],
  masu_past: (s) => [s.Imasu + 'ました'],
  masu_past_neg: (s) => [s.Imasu + 'ませんでした'],
  nai: (s) => [s.nai],
  ta: (s) => [s.ta],
  nakatta: (s) => [s.nai.slice(0, -1) + 'かった'],
  te: (s) => [s.te],
  naide: (s) => [s.nai + 'で'],
  tai: (s) => [s.I + 'たい'],
  tari: (s) => [s.ta + 'り'],
  tara: (s) => [s.ta + 'ら'],
  nagara: (s) => [s.I + 'ながら'],
  sou: (s) => [s.I + 'そう'],
  potential: (s) => s.pot,
  passive: (s) => s.pas,
  causative: (s) => s.caus,
  cpass: (s) => s.cpass,
  volitional: (s) => s.vol,
  imperative: (s) => s.imp,
  prohibitive: (s) => [s.dict + 'な'],
  ba: (s) => [s.ba],
  zuni: (s) => [s.zu + 'ずに'],
};

function adjForms(w: Word, s: string, f: AdjFormId, isKanji: boolean): string[] {
  if (w.t === 'ia') {
    const ii = w.f === 'ii';
    const b = ii ? (isKanji ? '良' : 'よ') : s.slice(0, -1);
    const m: Partial<Record<AdjFormId, string[]>> = {
      a_neg: [b + 'くない'],
      a_past: [b + 'かった'],
      a_pastneg: [b + 'くなかった'],
      a_polneg: [b + 'くないです', b + 'くありません'],
      a_te: [b + 'くて'],
      a_adv: [b + 'く'],
      a_ba: [b + 'ければ'],
      a_tara: [b + 'かったら'],
      a_sou: [b + (ii ? 'さそう' : 'そう')],
      a_sa: [b + 'さ'],
    };
    return m[f] ?? [];
  }
  const m: Partial<Record<AdjFormId, string[]>> = {
    a_neg: [s + 'じゃない', s + 'ではない'],
    a_past: [s + 'だった'],
    a_pastneg: [s + 'じゃなかった', s + 'ではなかった'],
    a_polneg: [s + 'じゃありません', s + 'ではありません', s + 'じゃないです', s + 'ではないです'],
    a_te: [s + 'で'],
    a_adv: [s + 'に'],
    a_pre: [s + 'な'],
    a_ba: [s + 'なら', s + 'ならば'],
    a_tara: [s + 'だったら'],
  };
  return m[f] ?? [];
}

/** Apakah bentuk f berlaku untuk kata w? */
export function applies(w: Word, f: FormId): boolean {
  const F = FORM_BY_ID[f];
  if (!F) return false;
  if (F.t === 'v' && !isVerb(w)) return false;
  if (F.t === 'a' && isVerb(w)) return false;
  if (F.only && !F.only.includes(w.t)) return false;
  if (isKeigoForm(f)) return !!KEIGO[w.k]?.[f === 'sonkei' ? 's' : 'k'];
  const lim = w.f ? LIMITS[w.f] : undefined;
  return !lim || lim.includes(f);
}

const cache = new Map<string, Solution[] | null>();

/**
 * Semua jawaban benar untuk kata w dalam bentuk f.
 * Jawaban pertama adalah bentuk utama; sisanya variasi yang juga diterima.
 * Mengembalikan null jika bentuk tidak berlaku.
 */
export function conjugate(w: Word, f: FormId): Solution[] | null {
  const key = w.k + '|' + f;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  let out: Solution[] | null = null;
  if (applies(w, f)) {
    if (isKeigoForm(f)) {
      const e = KEIGO[w.k][f === 'sonkei' ? 's' : 'k']!;
      if (e === 'g') {
        const suf = f === 'sonkei' ? 'になる' : 'する';
        out = [{ k: 'お' + stems(w, w.k).I + suf, r: 'お' + stems(w, w.r).I + suf }];
      } else {
        out = e.map((x) => {
          const [k, r] = x.split(':');
          return { k, r: r || k };
        });
      }
    } else if (isVerb(w)) {
      const fn = VERB_FORMS[f as VerbFormId];
      const K = fn(stems(w, w.k));
      const R = fn(stems(w, w.r));
      out = R.map((r, i) => ({ k: K[i], r }));
    } else {
      const K = adjForms(w, w.k, f as AdjFormId, true);
      const R = adjForms(w, w.r, f as AdjFormId, false);
      out = R.map((r, i) => ({ k: K[i], r }));
    }
  }
  cache.set(key, out);
  return out;
}

/** Jawaban tanpa duplikat cara baca: [utama, ...variasi] */
export function uniqueSolutions(sols: Solution[]): Solution[] {
  const seen = new Set<string>();
  return sols.filter((s) => !seen.has(s.r) && seen.add(s.r));
}
