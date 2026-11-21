import { describe, expect, it } from 'vitest';
import { FORMS } from '../data/forms';
import { KEIGO } from '../data/keigo';
import { WORDS } from '../data/words';
import type { FormId } from '../types';
import { applies, conjugate, WORD_BY_ID } from './conjugate';
import { explain } from './explain';

/** Jawaban utama (kanji/kana) */
const main = (k: string, f: FormId) => {
  const s = conjugate(WORD_BY_ID[k], f);
  return s ? `${s[0].k}/${s[0].r}` : null;
};
const all = (k: string, f: FormId) => conjugate(WORD_BY_ID[k], f)?.map((s) => s.r);

describe('godan', () => {
  it.each([
    ['書く', 'nai', '書かない/かかない'],
    ['書く', 'te', '書いて/かいて'],
    ['書く', 'potential', '書ける/かける'],
    ['書く', 'volitional', '書こう/かこう'],
    ['書く', 'imperative', '書け/かけ'],
    ['書く', 'ba', '書けば/かけば'],
    ['泳ぐ', 'te', '泳いで/およいで'],
    ['死ぬ', 'ta', '死んだ/しんだ'],
    ['飲む', 'te', '飲んで/のんで'],
    ['遊ぶ', 'ta', '遊んだ/あそんだ'],
    ['待つ', 'te', '待って/まって'],
    ['話す', 'te', '話して/はなして'],
    ['買う', 'nai', '買わない/かわない'],
    ['買う', 'passive', '買われる/かわれる'],
    ['帰る', 'te', '帰って/かえって'],
    ['帰る', 'nai', '帰らない/かえらない'],
    ['間に合う', 'nai', '間に合わない/まにあわない'],
  ] as [string, FormId, string][])('%s → %s', (k, f, want) => {
    expect(main(k, f)).toBe(want);
  });

  it('kausatif-pasif: bentuk pendek dan panjang, kecuali akhiran す', () => {
    expect(all('書く', 'cpass')).toEqual(['かかされる', 'かかせられる']);
    expect(all('話す', 'cpass')).toEqual(['はなさせられる']);
  });
});

describe('pengecualian', () => {
  it('行く', () => {
    expect(main('行く', 'te')).toBe('行って/いって');
    expect(main('行く', 'ta')).toBe('行った/いった');
    expect(main('行く', 'tara')).toBe('行ったら/いったら');
    expect(main('行く', 'nai')).toBe('行かない/いかない');
  });
  it('ある → ない', () => {
    expect(main('ある', 'nai')).toBe('ない/ない');
    expect(main('ある', 'nakatta')).toBe('なかった/なかった');
    expect(applies(WORD_BY_ID['ある'], 'potential')).toBe(false);
  });
  it('kata kerja hormat', () => {
    expect(main('いらっしゃる', 'masu')).toBe('いらっしゃいます/いらっしゃいます');
    expect(main('いらっしゃる', 'imperative')).toBe('いらっしゃい/いらっしゃい');
    expect(main('くださる', 'imperative')).toBe('ください/ください');
    expect(main('いらっしゃる', 'nai')).toBe('いらっしゃらない/いらっしゃらない');
  });
  it('くれる → くれ', () => {
    expect(main('くれる', 'imperative')).toBe('くれ/くれ');
  });
  it('いい → よ～', () => {
    expect(main('いい', 'a_neg')).toBe('良くない/よくない');
    expect(main('いい', 'a_sou')).toBe('良さそう/よさそう');
    expect(main('いい', 'a_sa')).toBe('良さ/よさ');
  });
});

describe('ichidan', () => {
  it('potensial menerima ら抜き', () => {
    expect(all('食べる', 'potential')).toEqual(['たべられる', 'たべれる']);
  });
  it('bentuk dasar', () => {
    expect(main('食べる', 'te')).toBe('食べて/たべて');
    expect(main('見る', 'volitional')).toBe('見よう/みよう');
    expect(main('起きる', 'imperative')).toBe('起きろ/おきろ');
    expect(main('寝る', 'ba')).toBe('寝れば/ねれば');
  });
});

describe('tak beraturan', () => {
  it('来る', () => {
    expect(main('来る', 'nai')).toBe('来ない/こない');
    expect(main('来る', 'masu')).toBe('来ます/きます');
    expect(main('来る', 'imperative')).toBe('来い/こい');
    expect(main('来る', 'ba')).toBe('来れば/くれば');
    expect(all('来る', 'potential')).toEqual(['こられる', 'これる']);
  });
  it('する dan kata benda + する', () => {
    expect(main('する', 'potential')).toBe('できる/できる');
    expect(main('勉強する', 'potential')).toBe('勉強できる/べんきょうできる');
    expect(main('勉強する', 'zuni')).toBe('勉強せずに/べんきょうせずに');
    expect(all('勉強する', 'imperative')).toEqual(['べんきょうしろ', 'べんきょうせよ']);
  });
});

describe('kata sifat', () => {
  it('い', () => {
    expect(main('高い', 'a_pastneg')).toBe('高くなかった/たかくなかった');
    expect(main('高い', 'a_ba')).toBe('高ければ/たかければ');
  });
  it('な (termasuk yang berakhir い)', () => {
    expect(all('きれい', 'a_neg')).toEqual(['きれいじゃない', 'きれいではない']);
    expect(main('嫌い', 'a_past')).toBe('嫌いだった/きらいだった');
    expect(main('静か', 'a_pre')).toBe('静かな/しずかな');
    expect(applies(WORD_BY_ID['静か'], 'a_sa')).toBe(false);
  });
});

describe('keigo', () => {
  it('pola umum お～になる / お～する', () => {
    expect(main('書く', 'sonkei')).toBe('お書きになる/おかきになる');
    expect(main('待つ', 'kenjou')).toBe('お待ちする/おまちする');
  });
  it('kata khusus', () => {
    expect(main('食べる', 'sonkei')).toBe('召し上がる/めしあがる');
    expect(main('見る', 'kenjou')).toBe('拝見する/はいけんする');
  });
  it('kata tanpa entri keigo tidak muncul', () => {
    expect(applies(WORD_BY_ID['泳ぐ'], 'sonkei')).toBe(false);
  });
});

describe('integritas data', () => {
  it('kanji (id) setiap kata unik', () => {
    const seen = new Set<string>();
    const dup = WORDS.filter((w) => seen.has(w.k) || !seen.add(w.k)).map((w) => w.k);
    expect(dup).toEqual([]);
  });

  it('setiap kata punya cara baca hiragana dan akhiran yang sesuai jenisnya', () => {
    const bad = WORDS.filter((w) => {
      if (!/^[ぁ-ゟ]+$/.test(w.r)) return true;
      if (w.t === 'i' || w.t === 'k') return !w.r.endsWith('る');
      if (w.t === 's') return !w.r.endsWith('する');
      if (w.t === 'g') return !/[うくぐすつぬぶむる]$/.test(w.r);
      if (w.t === 'ia') return !w.r.endsWith('い');
      return false;
    }).map((w) => w.k);
    expect(bad).toEqual([]);
  });

  it('kanji dan kana berakhiran sama (okurigana cocok)', () => {
    const bad = WORDS.filter((w) => w.t !== 'na' && w.t !== 'k' && w.k.slice(-1) !== w.r.slice(-1)).map((w) => w.k);
    expect(bad).toEqual([]);
  });

  it('setiap entri keigo merujuk ke kata yang ada', () => {
    expect(Object.keys(KEIGO).filter((k) => !WORD_BY_ID[k])).toEqual([]);
  });

  it('semua kombinasi kata × bentuk menghasilkan jawaban dan penjelasan yang valid', () => {
    const problems: string[] = [];
    let count = 0;
    for (const w of WORDS) {
      for (const F of FORMS) {
        if (!applies(w, F.id)) continue;
        count++;
        const sols = conjugate(w, F.id);
        if (!sols?.length) {
          problems.push(`${w.k} ${F.id}: tidak ada jawaban`);
          continue;
        }
        for (const s of sols) {
          if (!s.k || !s.r || /undefined|null/.test(s.k + s.r)) problems.push(`${w.k} ${F.id}: ${s.k}/${s.r}`);
          if (!/^[ぁ-ゟ]+$/.test(s.r)) problems.push(`${w.k} ${F.id}: bacaan bukan hiragana (${s.r})`);
        }
        const ex = explain(w, F.id);
        if (!ex.rule || /undefined/.test(ex.rule + ex.notes.join(''))) problems.push(`${w.k} ${F.id}: penjelasan rusak`);
      }
    }
    expect(problems).toEqual([]);
    expect(count).toBeGreaterThan(5000);
  });
});
