import { describe, expect, it } from 'vitest';
import { EXAMPLES } from '../data/examples';
import { FORMS } from '../data/forms';
import { WORD_BY_ID } from './conjugate';
import { exampleFor, highlightedReading, parseExample } from './examples';

describe('data contoh kalimat', () => {
  it('setiap bentuk punya minimal 2 contoh', () => {
    expect(FORMS.filter((F) => (EXAMPLES[F.id]?.length ?? 0) < 2).map((F) => F.id)).toEqual([]);
  });

  it('penulisan valid: kurung seimbang, ada sorotan, furigana berupa hiragana, ada terjemahan', () => {
    const bad: string[] = [];
    for (const [form, list] of Object.entries(EXAMPLES)) {
      for (const ex of list) {
        const s = ex.ja;
        const opens = (s.match(/\[/g) ?? []).length, closes = (s.match(/\]/g) ?? []).length;
        const bo = (s.match(/\{/g) ?? []).length, bc = (s.match(/\}/g) ?? []).length;
        if (opens !== closes || opens === 0 || bo !== bc) bad.push(`${form}: kurung tidak seimbang: ${s}`);
        for (const seg of parseExample(s)) {
          if (seg.ruby !== undefined && !/^[ぁ-ゟ]+$/.test(seg.ruby)) bad.push(`${form}: furigana bukan hiragana: ${s}`);
          if (seg.ruby === undefined && /[一-鿿]/.test(seg.text)) bad.push(`${form}: kanji tanpa furigana "${seg.text}": ${s}`);
          if (/[|{}[\]]/.test(seg.text)) bad.push(`${form}: penanda tersisa: ${s}`);
        }
        if (!ex.id.trim()) bad.push(`${form}: terjemahan kosong`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('parseExample', () => {
  it('memisahkan furigana dan sorotan', () => {
    expect(parseExample('{水|みず}が[{冷|つめ}たくて]、')).toEqual([
      { text: '水', ruby: 'みず', hl: false },
      { text: 'が', hl: false },
      { text: '冷', ruby: 'つめ', hl: true },
      { text: 'たくて', hl: true },
      { text: '、', hl: false },
    ]);
    expect(highlightedReading('{水|みず}が[{冷|つめ}たくて]、')).toBe('つめたくて');
  });
});

describe('exampleFor', () => {
  const ex = (k: string, f: Parameters<typeof exampleFor>[1]) => exampleFor(WORD_BY_ID[k], f).ja;

  it('mendahulukan contoh yang memakai kata itu sendiri', () => {
    expect(ex('冷たい', 'a_te')).toContain('{冷|つめ}たくて');
    expect(ex('静か', 'a_te')).toContain('{静|しず}かで');
    expect(ex('来る', 'potential')).toContain('{来|こ}られる');
    expect(ex('行く', 'kenjou')).toContain('{伺|うかが}います');
    expect(ex('褒める', 'passive')).toContain('{褒|ほ}められた');
  });

  it('tidak tertukar antara kata berkanji sama tapi berbeda bacaan', () => {
    expect(ex('降る', 'sou')).toContain('{降|ふ}りそう');
    expect(ex('降りる', 'sou')).not.toContain('{降|ふ}りそう');
  });

  it('pilihan untuk kata lain selalu sama (tidak acak)', () => {
    expect(ex('書く', 'te')).toBe(ex('書く', 'te'));
  });
});
