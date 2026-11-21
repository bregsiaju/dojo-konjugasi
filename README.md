# Dojo Konjugasi

Website latihan konjugasi kata kerja dan kata sifat bahasa Jepang (JLPT N5–N3).

- Jawaban diketik dalam kana. Bisa pakai keyboard Jepang, atau ketik romaji yang otomatis jadi kana.
- Setiap jawaban disertai aturan perubahan dan catatan pengecualian.
- Pengulangan berjarak: jawaban yang salah muncul lagi lebih cepat.
- Mode **Tebak Bentuk**, **Tabel** konjugasi per kata, dan **Statistik** akurasi per bentuk.

Dibuat dengan Vite, React, dan TypeScript. Progres disimpan di `localStorage` browser.

## Menjalankan

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev        # server pengembangan di http://localhost:5173
npm test           # unit test + smoke test halaman
npm run build      # cek tipe + build produksi ke dist/
npm run preview    # coba hasil build
```

## Struktur

```
src/
  data/
    words.ts        daftar kosakata (kanji, kana, arti, jenis, level)
    forms.ts        daftar bentuk konjugasi dan pengelompokannya
    keigo.ts        bentuk sonkeigo / kenjōgo per kata
    passive.ts      arti pasif bahasa Indonesia untuk kata kerja transitif (ditulis, dimakan, …)
    examples.ts     contoh kalimat per bentuk ({漢字|かんじ} = furigana, [ … ] = bagian yang disorot)
  lib/
    conjugate.ts    mesin konjugasi berbasis aturan
    explain.ts      penjelasan aturan dalam bahasa Indonesia
    gloss.ts        arti setiap bentuk (冷たくて → "dingin dan …; karena dingin, …")
    kana.ts         konversi romaji → kana dan normalisasi jawaban
    srs.ts          jadwal pengulangan berjarak dan pemilihan soal
  state/            pengaturan + progres (React context, localStorage)
  components/       komponen UI yang dipakai ulang
  pages/            Latihan, Tebak Bentuk, Tabel, Statistik, Pengaturan
  styles/global.css token warna (terang/gelap) dan gaya
```

## Menambah kosakata

1. Tambahkan satu baris di `src/data/words.ts`, mis.
   `{ k: '働く', r: 'はたらく', m: 'bekerja', t: 'g', lv: 5 },`
2. Jika kata itu punya pengecualian, beri tanda `f` (lihat komentar di atas file).
3. Jika ingin muncul di soal keigo, tambahkan entrinya di `src/data/keigo.ts`.
   Untuk kata kerja transitif, tambahkan juga arti pasifnya di `src/data/passive.ts`
   (tanpa itu, pasifnya diartikan sebagai pasif penderita: "terganggu karena ada yang …").
4. Jalankan `npm test`. Test memeriksa semua kombinasi kata × bentuk, termasuk cara baca, akhiran, dan id yang duplikat.

## Menambah bentuk konjugasi

1. Tambahkan id di `src/types.ts` (`VERB_FORM_IDS` atau `ADJ_FORM_IDS`).
2. Tambahkan definisinya di `src/data/forms.ts` dan masukkan ke salah satu `FORM_GROUPS`.
3. Tambahkan rumusnya di `src/lib/conjugate.ts` dan penjelasannya di `src/lib/explain.ts`.
   TypeScript akan menandai tempat yang belum diisi.

## Deploy (Netlify)

Hubungkan repo ini di Netlify. Semua pengaturan sudah ada di `netlify.toml`:
build `npm run build`, publish `dist`, dan redirect agar rute seperti `/statistik` tetap jalan saat di-refresh.
