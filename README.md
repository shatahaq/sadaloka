# Sadaloka — Frontend

Website OTA ekowisata beretika untuk Kabupaten Langkat. Tahap ini fokus pada UI/UX & frontend; backend menyusul.

**Stack:** React 19 · Vite · Tailwind CSS v4 · React Router 7 · lucide-react · font self-hosted (Fraunces, Geist, Geist Mono).

## Menjalankan

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # output ke dist/
npm run preview
```

## Struktur

```
src/
  assets/img/      foto koridor (webp) & varian logo transparan
  components/      Header, Footer, CorridorMap (peta skematik), CostBreakdown, PackageCard, ui.jsx
  sections/        bagian-bagian Beranda (Hero, QuickAccess, Corridors, …)
  pages/           Beranda, Paket, Detail Paket, Koridor, Pemandu, Smart Match, Transparansi, Checkout
  data/            corridors.js · packages.js · guides.js · content.js  ← ganti dengan API nanti
  lib/             format rupiah, hook reveal, algoritma Smart Match
  i18n/            I18nProvider + kamus ID/EN (dict.js)
```

## Bahasa (ID / EN)

- Pengalih bahasa ada di header (desktop) dan di menu mobile; pilihan disimpan di `localStorage` (`sadaloka-lang`), default Bahasa Indonesia.
- Teks UI ada di `src/i18n/dict.js` → pakai `t('namespace.kunci', { var })`.
- Konten data (koridor, paket, pemandu, FAQ) ditulis `{ id: '…', en: '…' }` → dibaca dengan `tr(nilai)`.
- Menambah bahasa baru: tambahkan blok di `dict.js`, kolom bahasa di data, dan kode di `LANGS` (`src/i18n/index.jsx`).

Design token (warna, font, radius) ada di `src/index.css` blok `@theme`, diturunkan dari palet logo.

## Halaman & rute

| Rute | Isi |
|---|---|
| `/` | Hero + pencarian cepat, 3 Gerbang Akses, 5 Koridor (peta interaktif saat scroll), paket pilihan, Mengapa Sadaloka, Alur 10 langkah, FAQ |
| `/paket` | Katalog dengan filter koridor/durasi/anggaran/kesulitan/minat, sort, sheet filter di mobile |
| `/paket/:slug` | Detail: itinerary per hari, termasuk/tidak, rincian biaya transparan, etika, pemandu, kartu pemesanan |
| `/koridor/:slug` | Halaman koridor: ringkasan, peta, aktivitas, paket & pemandu di koridor |
| `/guide` | Direktori pemandu HPI dengan pencarian, filter, dan drawer profil |
| `/smart-match` | Wizard 4 langkah → 3 rekomendasi dengan skor & alasan |
| `/transparansi` | Struktur biaya rata-rata & per paket, etika rimba, kemitraan |
| `/pesan/:slug` | Checkout 3 langkah (detail → bayar → selesai) — **mock, tanpa pembayaran** |

## Data contoh (perlu diganti sebelum rilis)

- Nama pemandu, nomor lisensi HPI, jumlah trip, sisa slot, nomor WhatsApp (`+62 812-0000-0000`), dan email adalah **placeholder**.
- Paket selain harga "mulai" per koridor (dari dokumen konten) adalah turunan contoh; persentase rincian biaya juga contoh.
- Koordinat/posisi peta bersifat skematik.
- Foto: hanya 5 foto dari dokumen; foto Teroh-Teroh (254 px) dan foto lain (~680 px) sebaiknya diganti versi resolusi tinggi (min. 1600 px).
