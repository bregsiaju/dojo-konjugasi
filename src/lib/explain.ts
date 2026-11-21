import { KEIGO } from '../data/keigo';
import type { Explanation, FormId, Word } from '../types';
import { conjugate, IE_ROW, isKeigoForm, isVerb, ROW, stems, TE } from './conjugate';

const MASU_SUFFIX: Partial<Record<FormId, string>> = {
  masu: 'ます', masu_neg: 'ません', masu_past: 'ました', masu_past_neg: 'ませんでした',
};

/** Penjelasan aturan perubahan untuk kata w ke bentuk f (bahasa Indonesia, HTML pendek). */
export function explain(w: Word, f: FormId): Explanation {
  if (isKeigoForm(f)) return explainKeigo(w, f);
  if (!isVerb(w)) return explainAdj(w, f);
  if (w.t === 'g') return explainGodan(w, f);
  if (w.t === 'i') return explainIchidan(w, f);
  if (w.t === 's') return explainSuru(w, f);
  return explainKuru(w, f);
}

function explainKeigo(w: Word, f: 'sonkei' | 'kenjou'): Explanation {
  const e = KEIGO[w.k]?.[f === 'sonkei' ? 's' : 'k'];
  let rule: string;
  if (e === 'g') {
    rule = `Pola umum: <b>お</b> + bentuk ます tanpa ます (${stems(w, w.r).I}) + <b>${f === 'sonkei' ? 'になる' : 'する'}</b>`;
  } else if (w.t === 's' && w.k !== 'する') {
    rule = f === 'sonkei'
      ? 'Kata benda Sino-Jepang: <b>ご</b> + kata benda + <b>になる</b> / <b>なさる</b>'
      : 'Kata benda Sino-Jepang: <b>ご</b>/<b>お</b> + kata benda + <b>する</b> / <b>いたす</b>';
  } else {
    rule = 'Kata kerja keigo khusus. Tidak mengikuti pola お～になる, jadi perlu dihafal.';
  }
  return { rule, notes: [] };
}

function explainGodan(w: Word, f: FormId): Explanation {
  const notes: string[] = [];
  const R = w.r;
  const L = R.slice(-1);
  const row = ROW[L];
  const [A, I, , E, O] = row;
  const teEnd = TE[L];
  const taEnd = teEnd.replace('て', 'た').replace('で', 'だ');
  const teGroup = ({ って: 'う・つ・る', いて: 'く', いで: 'ぐ', して: 'す', んで: 'ぬ・ぶ・む' } as Record<string, string>)[teEnd];
  const swap = (to: string, rowLabel: string, suffix?: string) =>
    `Ganti <b>${L}</b> → <b>${to}</b> (baris ${rowLabel})` + (suffix ? `, lalu + <b>${suffix}</b>` : '');
  const st = stems(w, R);
  let rule = '';

  switch (f) {
    case 'masu': case 'masu_neg': case 'masu_past': case 'masu_past_neg':
      rule = w.f === 'hon'
        ? `Kata kerja hormat khusus: <b>る</b> → <b>い</b>, lalu + <b>${MASU_SUFFIX[f]}</b>`
        : swap(I, 'い', MASU_SUFFIX[f]);
      break;
    case 'nai':
      rule = w.f === 'aru' ? 'Pengecualian: <b>ある → ない</b> (bukan あらない)' : swap(A, 'あ', 'ない');
      break;
    case 'nakatta':
      rule = `Bentuk ない (${st.nai}) → ganti <b>ない</b> dengan <b>なかった</b>`;
      break;
    case 'naide':
      rule = `Bentuk ない (${st.nai}) + <b>で</b>`;
      break;
    case 'te': case 'ta':
      rule = w.f === 'iku'
        ? `Pengecualian: <b>行く → 行${f === 'te' ? 'って' : 'った'}</b> (bukan 行い${f === 'te' ? 'て' : 'た'})`
        : `Akhiran <b>${teGroup}</b> → <b>${f === 'te' ? teEnd : taEnd}</b>`;
      break;
    case 'tara': case 'tari':
      rule = `Bentuk た (${st.ta}) + <b>${f === 'tara' ? 'ら' : 'り'}</b>`;
      if (w.f === 'iku') notes.push('行く memakai 行った, bukan 行いた.');
      break;
    case 'tai': rule = swap(I, 'い', 'たい'); break;
    case 'nagara': rule = swap(I, 'い', 'ながら'); break;
    case 'sou': rule = swap(I, 'い', 'そう'); break;
    case 'potential': rule = swap(E, 'え', 'る'); break;
    case 'passive': rule = swap(A, 'あ', 'れる'); break;
    case 'causative': rule = swap(A, 'あ', 'せる'); break;
    case 'cpass':
      rule = L === 'す'
        ? swap(A, 'あ', 'せられる') + '. Kata kerja berakhiran す tidak punya bentuk pendek ～される.'
        : swap(A, 'あ', 'される') + ' (bentuk pendek). Bentuk panjang ～せられる juga benar.';
      break;
    case 'volitional': rule = swap(O, 'お', 'う'); break;
    case 'imperative':
      rule = w.f === 'hon' ? 'Kata kerja hormat khusus: <b>る</b> → <b>い</b>' : swap(E, 'え');
      break;
    case 'prohibitive': rule = 'Bentuk kamus + <b>な</b>'; break;
    case 'ba': rule = swap(E, 'え', 'ば'); break;
    case 'zuni': rule = swap(A, 'あ', 'ずに'); break;
  }

  if (L === 'う' && ['nai', 'nakatta', 'naide', 'passive', 'causative', 'cpass', 'zuni'].includes(f)) {
    notes.push('Akhiran う berubah menjadi <b>わ</b>, bukan あ (買う → 買わない).');
  }
  if (L === 'る' && IE_ROW.includes(R.slice(-2, -1)) && w.f !== 'hon') {
    notes.push(`<b>${w.k}</b> termasuk Golongan I (godan), walaupun bentuknya seperti ～iる/～eる. Kata kerja seperti ini perlu dihafal.`);
  }
  return { rule, notes };
}

const ICHIDAN_SUFFIX: Partial<Record<FormId, string>> = {
  masu: 'ます', masu_neg: 'ません', masu_past: 'ました', masu_past_neg: 'ませんでした',
  nai: 'ない', nakatta: 'なかった', naide: 'ないで', ta: 'た', te: 'て', tara: 'たら', tari: 'たり',
  tai: 'たい', nagara: 'ながら', sou: 'そう', potential: 'られる', passive: 'られる', causative: 'させる',
  cpass: 'させられる', volitional: 'よう', imperative: 'ろ', ba: 'れば', zuni: 'ずに',
};

function explainIchidan(w: Word, f: FormId): Explanation {
  const notes: string[] = [];
  let rule = f === 'prohibitive' ? 'Bentuk kamus + <b>な</b>' : `Buang <b>る</b>, lalu + <b>${ICHIDAN_SUFFIX[f]}</b>`;
  if (f === 'imperative' && w.f === 'kureru') rule = 'Pengecualian: <b>くれる → くれ</b> (bukan くれろ)';
  if (f === 'potential') notes.push('Dalam percakapan sering disingkat menjadi ～れる (ら抜き), mis. 食べれる. Itu juga diterima.');
  if (f === 'passive') notes.push('Bentuk pasif Golongan II sama persis dengan bentuk potensial.');
  return { rule, notes };
}

function explainSuru(w: Word, f: FormId): Explanation {
  const notes: string[] = [];
  const prefix = w.r.slice(0, -2);
  const answer = conjugate(w, f)![0].r;
  const rule = `Tak beraturan: <b>する → ${answer.slice(prefix.length)}</b>`;
  if (prefix) notes.push('Kata benda + する: cukup ubah bagian する.');
  if (f === 'zuni') notes.push('する → せずに (bukan しずに).');
  if (f === 'potential') notes.push('Bentuk potensial する adalah できる.');
  return { rule, notes };
}

function explainKuru(w: Word, f: FormId): Explanation {
  return {
    rule: `Tak beraturan: <b>くる → ${conjugate(w, f)![0].r}</b>`,
    notes: ['Perhatikan vokal pertamanya: こ (ない・よう・られる・させる・い), き (ます・て・た), く (る・れば・な).'],
  };
}

const IA_SUFFIX: Partial<Record<FormId, string>> = {
  a_neg: 'くない', a_past: 'かった', a_pastneg: 'くなかった', a_polneg: 'くないです / くありません',
  a_te: 'くて', a_adv: 'く', a_ba: 'ければ', a_tara: 'かったら', a_sou: 'そう', a_sa: 'さ',
};
const NA_SUFFIX: Partial<Record<FormId, string>> = {
  a_neg: 'じゃない (lisan) / ではない (formal)', a_past: 'だった', a_pastneg: 'じゃなかった / ではなかった',
  a_polneg: 'じゃありません / ではありません', a_te: 'で', a_adv: 'に', a_pre: 'な (sebelum kata benda)',
  a_ba: 'なら(ば)', a_tara: 'だったら',
};

function explainAdj(w: Word, f: FormId): Explanation {
  const notes: string[] = [];
  if (w.t === 'ia') {
    if (w.f === 'ii') {
      notes.push('いい selalu berubah menjadi よ～ (よくない, よかった), bukan いくない.');
      return { rule: `いい memakai akar <b>よ</b>～: よ + <b>${f === 'a_sou' ? 'さそう' : IA_SUFFIX[f]}</b>`, notes };
    }
    return { rule: `Buang <b>い</b>, lalu + <b>${IA_SUFFIX[f]}</b>`, notes };
  }
  if (w.r.endsWith('い')) {
    notes.push(`<b>${w.k}</b> adalah kata sifat な walaupun berakhir い. Jangan diubah menjadi ～くない.`);
  }
  return { rule: `Kata sifat tidak berubah, tambahkan <b>${NA_SUFFIX[f]}</b>`, notes };
}
