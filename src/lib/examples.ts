import { EXAMPLES, type Example } from '../data/examples';
import type { FormId, Word } from '../types';
import { conjugate } from './conjugate';

/** Potongan kalimat: teks biasa atau kanji ber-furigana, dan apakah bagian yang disorot. */
export interface Segment {
  text: string;
  ruby?: string;
  hl: boolean;
}

/** Ubah "{漢字|かんじ}を[{書|か}く]" menjadi daftar potongan. */
export function parseExample(s: string): Segment[] {
  const out: Segment[] = [];
  let hl = false;
  let i = 0;
  const pushText = (t: string) => {
    const last = out[out.length - 1];
    if (last && !last.ruby && last.hl === hl) last.text += t;
    else out.push({ text: t, hl });
  };
  while (i < s.length) {
    const c = s[i];
    if (c === '[') { hl = true; i++; continue; }
    if (c === ']') { hl = false; i++; continue; }
    if (c === '{') {
      const end = s.indexOf('}', i);
      const [text, ruby] = s.slice(i + 1, end).split('|');
      out.push({ text, ruby, hl });
      i = end + 1;
      continue;
    }
    pushText(c);
    i++;
  }
  return out;
}

/** Cara baca (hiragana) dari bagian yang disorot saja. */
export function highlightedReading(s: string): string {
  return parseExample(s).filter((x) => x.hl).map((x) => x.ruby ?? x.text).join('');
}

/**
 * Apakah contoh ini memakai kata w dalam bentuk f?
 * Dibandingkan lewat cara baca, supaya 降る (ふる) dan 降りる (おりる) tidak tertukar.
 * Contoh boleh memakai turunan bentuknya (褒められた untuk pasif 褒められる).
 */
function usesWord(ex: Example, w: Word, f: FormId): boolean {
  const hl = highlightedReading(ex.ja);
  return (conjugate(w, f) ?? []).some((s) => (s.r.length >= 4 ? hl.startsWith(s.r.slice(0, -1)) : hl.startsWith(s.r)));
}

/**
 * Pilih contoh untuk kata w dalam bentuk f.
 * Contoh yang memakai kata itu sendiri didahulukan; selain itu dipilih tetap per kata
 * (supaya tidak berganti-ganti saat halaman dirender ulang).
 */
export function exampleFor(w: Word, f: FormId): Example {
  const list = EXAMPLES[f];
  const own = list.find((ex) => usesWord(ex, w, f));
  if (own) return own;
  // Hindari contoh yang tulisannya tampak sama dengan kata ini tapi bacaannya lain
  // (mis. 降りそう dari 降る untuk soal 降りる) supaya tidak membingungkan.
  const safe = list.filter((ex) => !looksLikeWord(ex, w, f));
  const pool = safe.length ? safe : list;
  let h = 0;
  for (const ch of w.k) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

function looksLikeWord(ex: Example, w: Word, f: FormId): boolean {
  const surface = parseExample(ex.ja).filter((x) => x.hl).map((x) => x.text).join('');
  return (conjugate(w, f) ?? []).some((s) => s.k !== s.r && surface.startsWith(s.k.slice(0, -1)));
}
