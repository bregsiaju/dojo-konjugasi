import type { FormId } from '../types';

/**
 * Contoh kalimat per bentuk.
 *
 * Penulisan:
 *   {漢字|かんじ}  → kanji dengan furigana
 *   [ … ]         → bagian yang dikonjugasi (disorot)
 *
 * Saat latihan, contoh yang bagian sorotnya memakai kata yang sedang dilatih
 * akan dipilih lebih dulu (mis. 冷たい + ～くて → 水が冷たくて…).
 */
export interface Example {
  ja: string;
  id: string;
}

export const EXAMPLES: Record<FormId, Example[]> = {
  masu: [
    { ja: '{毎朝|まいあさ}コーヒーを[{飲|の}みます]。', id: 'Setiap pagi saya minum kopi.' },
    { ja: '{来週|らいしゅう}、{京都|きょうと}へ[{行|い}きます]。', id: 'Minggu depan saya pergi ke Kyoto.' },
  ],
  masu_neg: [
    { ja: '{私|わたし}はお{酒|さけ}を[{飲|の}みません]。', id: 'Saya tidak minum minuman beralkohol.' },
    { ja: '{日曜日|にちようび}は{会社|かいしゃ}へ[{行|い}きません]。', id: 'Hari Minggu saya tidak pergi ke kantor.' },
  ],
  masu_past: [
    { ja: '{昨日|きのう}、{友達|ともだち}に[{会|あ}いました]。', id: 'Kemarin saya bertemu teman.' },
    { ja: '{先週|せんしゅう}、{映画|えいが}を[{見|み}ました]。', id: 'Minggu lalu saya menonton film.' },
  ],
  masu_past_neg: [
    { ja: '{昨日|きのう}は{何|なに}も[{食|た}べませんでした]。', id: 'Kemarin saya tidak makan apa-apa.' },
    { ja: '{宿題|しゅくだい}を[しませんでした]。', id: 'Saya tidak mengerjakan PR.' },
  ],
  nai: [
    { ja: '{今日|きょう}は{学校|がっこう}へ[{行|い}かない]。', id: 'Hari ini aku tidak pergi ke sekolah.' },
    { ja: '{私|わたし}は{肉|にく}を[{食|た}べない]。', id: 'Aku tidak makan daging.' },
  ],
  ta: [
    { ja: '{昨日|きのう}、{新|あたら}しい{靴|くつ}を[{買|か}った]。', id: 'Kemarin aku membeli sepatu baru.' },
    { ja: 'もう{宿題|しゅくだい}を[した]？', id: 'Sudah mengerjakan PR?' },
  ],
  nakatta: [
    { ja: '{昨日|きのう}は{雨|あめ}が[{降|ふ}らなかった]。', id: 'Kemarin tidak hujan.' },
    { ja: '{先生|せんせい}の{話|はなし}が[{分|わ}からなかった]。', id: 'Aku tidak mengerti penjelasan guru.' },
  ],
  te: [
    { ja: '{窓|まど}を[{開|あ}けて]ください。', id: 'Tolong buka jendelanya.' },
    { ja: '{朝|あさ}ご{飯|はん}を[{食|た}べて]、{学校|がっこう}へ{行|い}きました。', id: 'Saya sarapan, lalu pergi ke sekolah.' },
    { ja: '{今|いま}、{本|ほん}を[{読|よ}んで]います。', id: 'Sekarang saya sedang membaca buku.' },
  ],
  naide: [
    { ja: 'ここで{写真|しゃしん}を[{撮|と}らないで]ください。', id: 'Tolong jangan memotret di sini.' },
    { ja: '{朝|あさ}ご{飯|はん}を[{食|た}べないで]{出|で}かけた。', id: 'Aku pergi tanpa sarapan.' },
  ],
  tai: [
    { ja: '{日本|にほん}へ[{行|い}きたい]です。', id: 'Saya ingin pergi ke Jepang.' },
    { ja: '{冷|つめ}たい{水|みず}が[{飲|の}みたい]。', id: 'Aku ingin minum air dingin.' },
  ],
  tari: [
    { ja: '{休|やす}みの{日|ひ}は、{本|ほん}を[{読|よ}んだり]{映画|えいが}を[{見|み}たり]します。', id: 'Pada hari libur, saya membaca buku, menonton film, dan sebagainya.' },
    { ja: '{週末|しゅうまつ}は[{掃除|そうじ}したり]、[{洗濯|せんたく}したり]します。', id: 'Akhir pekan saya bersih-bersih, mencuci pakaian, dan lain-lain.' },
  ],
  tara: [
    { ja: '{駅|えき}に[{着|つ}いたら]、{電話|でんわ}してください。', id: 'Kalau sudah sampai di stasiun, tolong telepon.' },
    { ja: '{雨|あめ}が[{降|ふ}ったら]、{行|い}きません。', id: 'Kalau hujan, saya tidak pergi.' },
  ],
  nagara: [
    { ja: '{音楽|おんがく}を[{聞|き}きながら]{勉強|べんきょう}します。', id: 'Saya belajar sambil mendengarkan musik.' },
    { ja: '[{歩|ある}きながら]スマホを{見|み}ないでください。', id: 'Tolong jangan melihat HP sambil berjalan.' },
  ],
  sou: [
    { ja: '{雨|あめ}が[{降|ふ}りそう]です。', id: 'Sepertinya akan hujan.' },
    { ja: '{棚|たな}から{本|ほん}が[{落|お}ちそう]だ。', id: 'Bukunya kelihatannya akan jatuh dari rak.' },
  ],
  potential: [
    { ja: '{漢字|かんじ}が[{読|よ}める]？', id: 'Kamu bisa membaca kanji?' },
    { ja: '{明日|あした}は[{来|こ}られる]？', id: 'Besok bisa datang?' },
    { ja: '{私|わたし}は{日本語|にほんご}が{少|すこ}し[{話|はな}せます]。', id: 'Saya bisa sedikit berbicara bahasa Jepang.' },
  ],
  passive: [
    { ja: '{先生|せんせい}に[{褒|ほ}められた]。', id: 'Aku dipuji oleh guru.' },
    { ja: 'この{本|ほん}は{多|おお}くの{人|ひと}に[{読|よ}まれて]います。', id: 'Buku ini dibaca oleh banyak orang.' },
    { ja: '{雨|あめ}に[{降|ふ}られて]、{服|ふく}がぬれた。', id: 'Aku kehujanan, jadi bajuku basah. (pasif penderita)' },
  ],
  causative: [
    { ja: '{母|はは}は{弟|おとうと}に{野菜|やさい}を[{食|た}べさせる]。', id: 'Ibu menyuruh adik makan sayur.' },
    { ja: '{少|すこ}し[{休|やす}ませて]ください。', id: 'Tolong izinkan saya istirahat sebentar.' },
  ],
  cpass: [
    { ja: '{子|こ}どものころ、{毎日|まいにち}ピアノを[{練習|れんしゅう}させられた]。', id: 'Waktu kecil, aku dipaksa latihan piano setiap hari.' },
    { ja: '{先輩|せんぱい}にお{酒|さけ}を[{飲|の}まされた]。', id: 'Aku dipaksa minum sake oleh senior.' },
  ],
  volitional: [
    { ja: '{一緒|いっしょ}に[{帰|かえ}ろう]。', id: 'Ayo pulang bersama.' },
    { ja: '{来年|らいねん}、{日本|にほん}へ[{行|い}こう]と{思|おも}っています。', id: 'Saya berniat pergi ke Jepang tahun depan.' },
  ],
  imperative: [
    { ja: '{早|はや}く[{起|お}きろ]！', id: 'Cepat bangun!' },
    { ja: '[{頑張|がんば}れ]！', id: 'Semangat! (Berjuanglah!)' },
  ],
  prohibitive: [
    { ja: 'ここで[{泳|およ}ぐな]。', id: 'Jangan berenang di sini!' },
    { ja: '[{諦|あきら}めるな]！', id: 'Jangan menyerah!' },
  ],
  ba: [
    { ja: 'この{薬|くすり}を[{飲|の}めば]、すぐ{治|なお}ります。', id: 'Kalau minum obat ini, akan segera sembuh.' },
    { ja: '[{急|いそ}げば]{間|ま}に{合|あ}う。', id: 'Kalau bergegas, masih keburu.' },
  ],
  zuni: [
    { ja: '{何|なに}も[{言|い}わずに]{帰|かえ}った。', id: 'Dia pulang tanpa berkata apa-apa.' },
    { ja: '{辞書|じしょ}を[{使|つか}わずに]{読|よ}めます。', id: 'Bisa dibaca tanpa memakai kamus.' },
  ],
  sonkei: [
    { ja: '{社長|しゃちょう}はもう[お{帰|かえ}りになりました]。', id: 'Direktur sudah pulang.' },
    { ja: '{先生|せんせい}は{何|なん}と[おっしゃいました]か。', id: 'Bapak/Ibu guru tadi bilang apa?' },
    { ja: '{何|なに}を[{召|め}し{上|あ}がります]か。', id: 'Anda mau makan/minum apa?' },
  ],
  kenjou: [
    { ja: '{明日|あした}、そちらに[{伺|うかが}います]。', id: 'Besok saya akan berkunjung ke sana.' },
    { ja: '{私|わたし}が[お{持|も}ちします]。', id: 'Biar saya yang membawakan.' },
    { ja: '{田中|たなか}と[{申|もう}します]。', id: 'Nama saya Tanaka.' },
  ],
  a_neg: [
    { ja: 'この{部屋|へや}は[{広|ひろ}くない]。', id: 'Kamar ini tidak luas.' },
    { ja: 'この{町|まち}は[{静|しず}かじゃない]。', id: 'Kota ini tidak tenang.' },
  ],
  a_past: [
    { ja: '{昨日|きのう}は[{暑|あつ}かった]。', id: 'Kemarin panas.' },
    { ja: '{昔|むかし}、この{公園|こうえん}は[{賑|にぎ}やかだった]。', id: 'Dulu, taman ini ramai.' },
  ],
  a_pastneg: [
    { ja: 'テストは[{難|むずか}しくなかった]。', id: 'Ujiannya tidak sulit.' },
    { ja: '{前|まえ}は{野菜|やさい}が[{好|す}きじゃなかった]。', id: 'Dulu aku tidak suka sayur.' },
  ],
  a_polneg: [
    { ja: 'この{料理|りょうり}は[{辛|から}くないです]。', id: 'Masakan ini tidak pedas.' },
    { ja: '{日曜日|にちようび}は[{暇|ひま}じゃありません]。', id: 'Hari Minggu saya tidak senggang.' },
  ],
  a_te: [
    { ja: '{水|みず}が[{冷|つめ}たくて]、{気持|きも}ちいい。', id: 'Airnya dingin dan menyegarkan.' },
    { ja: '[{忙|いそが}しくて]、{昼|ひる}ご{飯|はん}を{食|た}べる{時間|じかん}がない。', id: 'Karena sibuk, tidak ada waktu untuk makan siang.' },
    { ja: 'この{部屋|へや}は[{静|しず}かで]、{明|あか}るいです。', id: 'Kamar ini tenang dan terang.' },
  ],
  a_adv: [
    { ja: '[{早|はや}く]{起|お}きてください。', id: 'Tolong cepat bangun.' },
    { ja: '{字|じ}を[きれいに]{書|か}いてください。', id: 'Tolong tulis hurufnya dengan rapi.' },
    { ja: 'だんだん[{暖|あたた}かく]なりました。', id: 'Lama-lama menjadi hangat.' },
  ],
  a_pre: [
    { ja: '[{静|しず}かな]{部屋|へや}で{勉強|べんきょう}したい。', id: 'Aku ingin belajar di kamar yang tenang.' },
    { ja: '[{好|す}きな]{食|た}べ{物|もの}は{何|なん}ですか。', id: 'Makanan kesukaanmu apa?' },
  ],
  a_ba: [
    { ja: '[{安|やす}ければ]{買|か}います。', id: 'Kalau murah, saya beli.' },
    { ja: '[{暇|ひま}なら]、{一緒|いっしょ}に{遊|あそ}ぼう。', id: 'Kalau senggang, ayo main bareng.' },
  ],
  a_tara: [
    { ja: '[{寒|さむ}かったら]、{窓|まど}を{閉|し}めてください。', id: 'Kalau dingin, tolong tutup jendelanya.' },
    { ja: '[{大変|たいへん}だったら]、{手伝|てつだ}いますよ。', id: 'Kalau repot, saya bantu, lho.' },
  ],
  a_sou: [
    { ja: 'このケーキは[おいしそう]だ。', id: 'Kue ini kelihatannya enak.' },
    { ja: '{彼|かれ}は[{忙|いそが}しそう]です。', id: 'Dia kelihatannya sibuk.' },
    { ja: '[よさそう]ですね。', id: 'Kelihatannya bagus, ya.' },
  ],
  a_sa: [
    { ja: 'この{山|やま}の[{高|たか}さ]は3000メートルです。', id: 'Tinggi gunung ini 3.000 meter.' },
    { ja: '{夏|なつ}の[{暑|あつ}さ]に{負|ま}けないでください。', id: 'Jangan sampai kalah oleh panasnya musim panas.' },
  ],
};
