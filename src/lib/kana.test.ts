import { describe, expect, it } from 'vitest';
import { normalizeAnswer, romaToKana } from './kana';

describe('romaToKana', () => {
  it.each([
    ['kaita', 'かいた'],
    ['kakanai', 'かかない'],
    ['shinde', 'しんで'],
    ['itte', 'いって'],
    ['matchi', 'まっち'],
    ['konnichiha', 'こんにちは'],
    ['annnai', 'あんない'],
    ["an'nai", 'あんない'],
    ['benkyou', 'べんきょう'],
    ['kyou', 'きょう'],
    ['tabesaserareru', 'たべさせられる'],
  ])('%s → %s', (input, want) => {
    expect(romaToKana(input, true)).toBe(want);
  });

  it('menahan "n" di akhir saat masih mengetik', () => {
    expect(romaToKana('kan')).toBe('かn');
    expect(romaToKana('kan', true)).toBe('かん');
    expect(romaToKana('ann')).toBe('あnn');
    expect(romaToKana('anna')).toBe('あんな');
  });

  it('membiarkan kana yang sudah ada dan romaji yang belum lengkap', () => {
    expect(romaToKana('かky')).toBe('かky');
    expect(romaToKana('たべ')).toBe('たべ');
  });
});

describe('normalizeAnswer', () => {
  it('membuang spasi dan mengubah katakana jadi hiragana', () => {
    expect(normalizeAnswer(' タベル　')).toBe('たべる');
  });
});
