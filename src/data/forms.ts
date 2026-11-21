import type { FormDef, FormId, TypeKey, WordType } from '../types';

export const FORMS: FormDef[] = [
  { id: 'masu', t: 'v', lv: 5, name: 'Sopan', jp: '～ます', desc: 'Bentuk sopan, positif (sekarang atau akan datang).' },
  { id: 'masu_neg', t: 'v', lv: 5, name: 'Sopan negatif', jp: '～ません', desc: 'Bentuk sopan: tidak melakukan.' },
  { id: 'masu_past', t: 'v', lv: 5, name: 'Sopan lampau', jp: '～ました', desc: 'Bentuk sopan: sudah melakukan.' },
  { id: 'masu_past_neg', t: 'v', lv: 5, name: 'Sopan lampau negatif', jp: '～ませんでした', desc: 'Bentuk sopan: dulu tidak melakukan.' },
  { id: 'nai', t: 'v', lv: 5, name: 'Negatif', jp: '～ない', desc: 'Bentuk biasa: tidak melakukan.' },
  { id: 'ta', t: 'v', lv: 5, name: 'Lampau', jp: '～た', desc: 'Bentuk biasa: sudah melakukan.' },
  { id: 'nakatta', t: 'v', lv: 5, name: 'Lampau negatif', jp: '～なかった', desc: 'Bentuk biasa: dulu tidak melakukan.' },
  { id: 'te', t: 'v', lv: 5, name: 'Bentuk て', jp: '～て', desc: 'Penghubung: lalu…, tolong… (～てください), sedang… (～ている).' },
  { id: 'naide', t: 'v', lv: 5, name: 'Negatif て', jp: '～ないで', desc: 'Tanpa melakukan; tolong jangan… (～ないでください).' },
  { id: 'tai', t: 'v', lv: 5, name: 'Ingin', jp: '～たい', desc: 'Ingin melakukan.' },
  { id: 'tari', t: 'v', lv: 4, name: 'Daftar kegiatan', jp: '～たり', desc: 'Melakukan … dan … (antara lain).' },
  { id: 'tara', t: 'v', lv: 4, name: 'Syarat たら', jp: '～たら', desc: 'Kalau / setelah …' },
  { id: 'nagara', t: 'v', lv: 4, name: 'Sambil', jp: '～ながら', desc: 'Melakukan sesuatu sambil …' },
  { id: 'sou', t: 'v', lv: 4, name: 'Kelihatannya', jp: '～そう', desc: 'Tampaknya akan …' },
  { id: 'potential', t: 'v', lv: 4, name: 'Potensial', jp: '～える／～られる', desc: 'Bisa melakukan.' },
  { id: 'passive', t: 'v', lv: 4, name: 'Pasif', jp: '～れる／～られる', desc: 'Di-…, dikenai tindakan.' },
  { id: 'causative', t: 'v', lv: 4, name: 'Kausatif', jp: '～せる／～させる', desc: 'Menyuruh atau membiarkan orang lain melakukan.' },
  { id: 'cpass', t: 'v', lv: 3, name: 'Kausatif-pasif', jp: '～される／～させられる', desc: 'Dipaksa melakukan.' },
  { id: 'volitional', t: 'v', lv: 4, name: 'Ajakan', jp: '～おう／～よう', desc: 'Ayo / mari …; berniat … (～ようと思う).' },
  { id: 'imperative', t: 'v', lv: 4, name: 'Perintah', jp: '～え／～ろ', desc: 'Perintah langsung (kasar).' },
  { id: 'prohibitive', t: 'v', lv: 4, name: 'Larangan', jp: '～な', desc: 'Jangan …! (kasar).' },
  { id: 'ba', t: 'v', lv: 4, name: 'Syarat ば', jp: '～えば', desc: 'Jika …' },
  { id: 'zuni', t: 'v', lv: 3, name: 'Tanpa', jp: '～ずに', desc: 'Tanpa melakukan (lebih formal dari ～ないで).' },
  { id: 'sonkei', t: 'v', lv: 4, name: 'Sonkeigo', jp: '尊敬語', desc: 'Bahasa hormat: meninggikan tindakan orang lain. Jawab dalam bentuk kamus.' },
  { id: 'kenjou', t: 'v', lv: 4, name: 'Kenjōgo', jp: '謙譲語', desc: 'Bahasa merendah: merendahkan tindakan sendiri. Jawab dalam bentuk kamus.' },
  { id: 'a_neg', t: 'a', lv: 5, name: 'Negatif', jp: '～くない／～じゃない', desc: 'Tidak …' },
  { id: 'a_past', t: 'a', lv: 5, name: 'Lampau', jp: '～かった／～だった', desc: 'Dulu …' },
  { id: 'a_pastneg', t: 'a', lv: 5, name: 'Lampau negatif', jp: '～くなかった／～じゃなかった', desc: 'Dulu tidak …' },
  { id: 'a_polneg', t: 'a', lv: 5, name: 'Sopan negatif', jp: '～くないです／～じゃありません', desc: 'Tidak … (sopan).' },
  { id: 'a_te', t: 'a', lv: 5, name: 'Bentuk て', jp: '～くて／～で', desc: '… dan … (menyambung sifat).' },
  { id: 'a_adv', t: 'a', lv: 5, name: 'Adverbia', jp: '～く／～に', desc: 'Kata keterangan; juga dipakai dengan なる (～くなる / ～になる).' },
  { id: 'a_pre', t: 'a', lv: 5, name: 'Atributif', jp: '～な＋kata benda', desc: 'Menerangkan kata benda, mis. 静かな部屋.', only: ['na'] },
  { id: 'a_ba', t: 'a', lv: 4, name: 'Syarat', jp: '～ければ／～なら', desc: 'Jika …' },
  { id: 'a_tara', t: 'a', lv: 4, name: 'Syarat たら', jp: '～かったら／～だったら', desc: 'Kalau …' },
  { id: 'a_sou', t: 'a', lv: 4, name: 'Kelihatannya', jp: '～そう', desc: 'Kelihatannya …', only: ['ia'] },
  { id: 'a_sa', t: 'a', lv: 3, name: 'Kata benda', jp: '～さ', desc: 'Tingkat atau ukuran sifat (高さ = ketinggian).', only: ['ia'] },
];

export const FORM_BY_ID = Object.fromEntries(FORMS.map((f) => [f.id, f])) as Record<FormId, FormDef>;

export const FORM_GROUPS: [string, FormId[]][] = [
  ['Sopan (ます)', ['masu', 'masu_neg', 'masu_past', 'masu_past_neg']],
  ['Bentuk biasa', ['nai', 'ta', 'nakatta']],
  ['Bentuk て dan turunannya', ['te', 'naide', 'tara', 'tari']],
  ['Keinginan dan cara', ['tai', 'nagara', 'sou', 'zuni']],
  ['Potensial, pasif, kausatif', ['potential', 'passive', 'causative', 'cpass']],
  ['Ajakan, perintah, syarat', ['volitional', 'imperative', 'prohibitive', 'ba']],
  ['Keigo', ['sonkei', 'kenjou']],
  ['Kata sifat', ['a_neg', 'a_past', 'a_pastneg', 'a_polneg', 'a_te', 'a_adv', 'a_pre', 'a_ba', 'a_tara', 'a_sou', 'a_sa']],
];

export const GROUP_NAME: Record<WordType, string> = {
  g: 'Golongan I · godan',
  i: 'Golongan II · ichidan',
  s: 'Golongan III · する',
  k: 'Golongan III · 来る',
  ia: 'Kata sifat い',
  na: 'Kata sifat な',
};

export const TYPE_KEYS: [TypeKey, string][] = [
  ['g', 'Golongan I (godan)'],
  ['i', 'Golongan II (ichidan)'],
  ['irr', 'Golongan III (する・来る)'],
  ['ia', 'Kata sifat い'],
  ['na', 'Kata sifat な'],
];

/** Label bentuk lengkap, mis. "Kata sifat · Negatif" */
export const formLabel = (id: FormId) => (FORM_BY_ID[id].t === 'a' ? 'Kata sifat · ' : '') + FORM_BY_ID[id].name;
