export type Level = 3 | 4 | 5;

/** g = godan, i = ichidan, s = ～する, k = 来る, ia = kata sifat い, na = kata sifat な */
export type WordType = 'g' | 'i' | 's' | 'k' | 'ia' | 'na';

/** Tanda khusus untuk kata yang punya pengecualian. Lihat penjelasan di data/words.ts. */
export type WordFlag = 'iku' | 'aru' | 'hon' | 'kureru' | 'ii' | 'lim';

export interface Word {
  /** Tulisan kanji (juga dipakai sebagai id unik) */
  k: string;
  /** Cara baca dalam hiragana */
  r: string;
  /** Arti dalam bahasa Indonesia */
  m: string;
  t: WordType;
  lv: Level;
  f?: WordFlag;
}

/** Kelompok jenis kata untuk filter di Pengaturan (する dan 来る digabung). */
export type TypeKey = 'g' | 'i' | 'irr' | 'ia' | 'na';

export const VERB_FORM_IDS = [
  'masu', 'masu_neg', 'masu_past', 'masu_past_neg',
  'nai', 'ta', 'nakatta', 'te', 'naide',
  'tai', 'tari', 'tara', 'nagara', 'sou',
  'potential', 'passive', 'causative', 'cpass',
  'volitional', 'imperative', 'prohibitive', 'ba', 'zuni',
] as const;
export const KEIGO_FORM_IDS = ['sonkei', 'kenjou'] as const;
export const ADJ_FORM_IDS = [
  'a_neg', 'a_past', 'a_pastneg', 'a_polneg', 'a_te', 'a_adv', 'a_pre', 'a_ba', 'a_tara', 'a_sou', 'a_sa',
] as const;

export type VerbFormId = (typeof VERB_FORM_IDS)[number];
export type KeigoFormId = (typeof KEIGO_FORM_IDS)[number];
export type AdjFormId = (typeof ADJ_FORM_IDS)[number];
export type FormId = VerbFormId | KeigoFormId | AdjFormId;

export interface FormDef {
  id: FormId;
  /** v = kata kerja, a = kata sifat */
  t: 'v' | 'a';
  lv: Level;
  name: string;
  jp: string;
  desc: string;
  /** Hanya berlaku untuk jenis kata ini */
  only?: WordType[];
}

/** Satu jawaban benar: tulisan kanji dan cara bacanya. */
export interface Solution {
  k: string;
  r: string;
}

export interface Explanation {
  /** HTML pendek; <b> menandai bagian yang berubah */
  rule: string;
  notes: string[];
}

export interface Settings {
  levels: Record<Level, boolean>;
  types: Record<TypeKey, boolean>;
  forms: Record<FormId, boolean>;
  furigana: boolean;
  pattern: boolean;
  showGroup: boolean;
  romaji: boolean;
  weak: boolean;
}
