/** Tabel romaji → hiragana (gaya Hepburn + gaya kunrei/IME) */
const KANA_MAP: Record<string, string> = (() => {
  const m: Record<string, string> = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };
  const rows: Record<string, string> = {
    k: 'かきくけこ', s: 'さしすせそ', t: 'たちつてと', n: 'なにぬねの', h: 'はひふへほ', m: 'まみむめも',
    r: 'らりるれろ', g: 'がぎぐげご', z: 'ざじずぜぞ', d: 'だぢづでど', b: 'ばびぶべぼ', p: 'ぱぴぷぺぽ',
  };
  const vowels = 'aiueo';
  for (const c of Object.keys(rows)) {
    for (let j = 0; j < 5; j++) m[c + vowels[j]] = rows[c][j];
    const ii = rows[c][1];
    m[c + 'ya'] = ii + 'ゃ';
    m[c + 'yu'] = ii + 'ゅ';
    m[c + 'yo'] = ii + 'ょ';
  }
  Object.assign(m, {
    ya: 'や', yu: 'ゆ', yo: 'よ', wa: 'わ', wo: 'を', wi: 'うぃ', we: 'うぇ',
    shi: 'し', sha: 'しゃ', shu: 'しゅ', sho: 'しょ', she: 'しぇ',
    chi: 'ち', cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', che: 'ちぇ',
    tsu: 'つ', fu: 'ふ', fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ',
    ji: 'じ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ', je: 'じぇ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
    thi: 'てぃ', dhi: 'でぃ',
    xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ', la: 'ぁ', li: 'ぃ', lu: 'ぅ', le: 'ぇ', lo: 'ぉ',
    xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ',
    xtu: 'っ', ltu: 'っ', xtsu: 'っ', ltsu: 'っ',
  });
  return m;
})();

const VOWEL_OR_Y = 'aiueoy';
const DOUBLE_CONSONANTS = 'bcdfghjkmpqrstvwxz';

/**
 * Ubah romaji menjadi hiragana, seperti IME.
 * Kana yang sudah ada dibiarkan. Romaji yang belum lengkap (mis. "ky") dibiarkan apa adanya.
 *
 * @param final true saat jawaban dikirim: "n" atau "nn" di akhir menjadi ん.
 *              Saat masih mengetik, "nn" di akhir ditahan dulu supaya "nna" → んな.
 */
export function romaToKana(s: string, final = false): string {
  let out = '';
  let i = 0;
  const low = s.toLowerCase();
  while (i < low.length) {
    const c = low[i], n1 = low[i + 1], n2 = low[i + 2];
    if (!/[a-z'-]/.test(c)) { out += s[i]; i++; continue; }
    if (c === '-') { out += 'ー'; i++; continue; }
    if (c === "'") { i++; continue; }
    if (c === 'n') {
      if (n1 === undefined) { out += final ? 'ん' : 'n'; i++; continue; }
      if (n1 === "'") { out += 'ん'; i += 2; continue; }
      if (n1 === 'n') {
        if (n2 === undefined) { out += final ? 'ん' : 'nn'; i += 2; continue; }
        if (VOWEL_OR_Y.includes(n2)) { out += 'ん'; i += 1; continue; }
        out += 'ん'; i += 2; continue;
      }
      if (!VOWEL_OR_Y.includes(n1)) { out += 'ん'; i++; continue; }
    }
    if (n1 === c && DOUBLE_CONSONANTS.includes(c)) { out += 'っ'; i++; continue; }
    if (c === 't' && n1 === 'c' && n2 === 'h') { out += 'っ'; i++; continue; }
    let hit = false;
    for (let len = 4; len >= 1; len--) {
      const sub = low.substr(i, len);
      if (sub.length === len && KANA_MAP[sub]) { out += KANA_MAP[sub]; i += len; hit = true; break; }
    }
    if (!hit) { out += s.slice(i); break; }
  }
  return out;
}

/** Normalisasi jawaban: buang spasi, ubah katakana jadi hiragana. */
export function normalizeAnswer(s: string): string {
  return s
    .replace(/[\s　]/g, '')
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

export const hasLatin = (s: string) => /[a-z]/i.test(s);
