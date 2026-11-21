import { describe, expect, it } from 'vitest';
import { FORMS } from '../data/forms';
import { PASSIVE } from '../data/passive';
import { WORDS } from '../data/words';
import type { FormId } from '../types';
import { applies, WORD_BY_ID } from './conjugate';
import { gloss } from './gloss';

const g = (k: string, f: FormId) => gloss(WORD_BY_ID[k], f);

describe('gloss', () => {
  it('kata sifat', () => {
    expect(g('冷たい', 'a_te')).toBe('dingin dan …; karena dingin, …');
    expect(g('寒い', 'a_sa')).toBe('dinginnya (tingkat/ukuran)');
    expect(g('高い', 'a_neg')).toBe('tidak tinggi/mahal');
    expect(g('高い', 'a_sa')).toBe('tingginya/mahalnya (tingkat/ukuran)');
    expect(g('静か', 'a_pre')).toBe('… yang tenang');
  });

  it('kata kerja', () => {
    expect(g('書く', 'nai')).toBe('tidak menulis');
    expect(g('書く', 'tai')).toBe('ingin menulis');
    expect(g('書く', 'potential')).toBe('bisa menulis');
    expect(g('書く', 'cpass')).toBe('dipaksa menulis');
    expect(g('書く', 'prohibitive')).toBe('jangan menulis!');
  });

  it('pasif: transitif pakai daftar, intransitif pakai pasif penderita', () => {
    expect(g('書く', 'passive')).toBe('ditulis');
    expect(g('泣く', 'passive')).toBe('terganggu karena ada yang menangis (pasif penderita)');
  });

  it('perintah memakai kata dasar', () => {
    expect(g('書く', 'imperative')).toBe('tulis!');
    expect(g('聞く', 'imperative')).toBe('dengar/tanya!');
    expect(g('置く', 'imperative')).toBe('letakkan!');
    expect(g('帰る', 'imperative')).toBe('pulang!');
  });

  it('setiap entri pasif merujuk ke kata kerja yang ada', () => {
    const bad = Object.keys(PASSIVE).filter((k) => !WORD_BY_ID[k] || ['ia', 'na'].includes(WORD_BY_ID[k].t));
    expect(bad).toEqual([]);
  });

  it('semua kombinasi kata × bentuk punya arti', () => {
    const bad: string[] = [];
    for (const w of WORDS) {
      for (const F of FORMS) {
        if (!applies(w, F.id)) continue;
        const s = gloss(w, F.id);
        if (!s || /undefined|null/.test(s)) bad.push(`${w.k} ${F.id}: ${s}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
