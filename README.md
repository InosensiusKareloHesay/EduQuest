# 🎮 EduQuest — Learn, Play, Grow!

EduQuest adalah game edukasi interaktif berbasis web yang menggabungkan kegiatan belajar, kuis adaptif, pengumpulan reward koin, dan kustomisasi avatar chibi 2D layered.

Dibangun dengan:
- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS, Zustand, Web Audio Synthesizer, Canvas Confetti)
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security / RLS, Anti-Cheat RPC Function, Auth, Triggers)
- **Deployment**: Netlify (`netlify.toml` + `@netlify/plugin-nextjs`)

---

## 🌟 Fitur Utama Sesuai Game Design Document

### 1. Sistem Siswa (Student)
- **Dashboard & Home**: Tampilan avatar aktif, saldo koin, statistik belajar, dan kuis terakhir.
- **Kuis Adaptif & Pengacakan Soal**:
  - Pilihan ganda 4 opsi (A, B, C, D).
  - Soal acak terstruktur berdasarkan komposisi tingkat kesulitan: **Mudah**, **Sedang**, dan **Sulit**.
  - **Sistem Anti-Cheat**: Kunci jawaban tidak dikirimkan ke browser murid, penilaian dan perhitungan koin diverifikasi aman di server/RPC database.
  - Sesi kuis konsisten dan tidak berubah saat halaman di-refresh.
- **Sistem Reward Koin**:
  - Reward koin otomatis dari setiap jawaban benar ($\text{Coins} = \text{Jawaban Benar} \times \text{Reward}$).
  - Pembahasan lengkap setelah kuis selesai.
- **Avatar Chibi 2D Layered**:
  - Kustomisasi rambut, atasan, bawahan, sepatu, topi/mahkota, kacamata, dan tas/sayap peri.
  - Preview interaktif dengan berbagai ekspresi (Happy, Wink, Excited, Focused).
- **Toko Kosmetik (Shop)**:
  - Katalog aksesoris dengan harga koin.
  - Preview item langsung di karakter sebelum membeli.
  - Validasi saldo dan kepemilikan item otomatis.
- **Riwayat & Pencapaian**:
  - Rekap sesi kuis, persentase nilai, dan mutasi reward koin.

### 2. Sistem Guru & Admin (Teacher / Admin)
- **Role Switcher**: Tombol cepat di Navbar untuk beralih antara sudut pandang Siswa dan Guru/Admin.
- **Mata Pelajaran & Kategori Dinamis**:
  - CRUD mata pelajaran dan kategori (contoh awal: Matematika - Pecahan, Operasi Hitung, Bangun Datar).
- **Bank Soal Lengkap**:
  - Input pertanyaan, opsi A/B/C/D, penentuan kunci jawaban dengan radio button.
  - Tingkat kesulitan (Mudah, Sedang, Sulit).
  - Pembahasan jawaban edukatif.
  - Status Draft / Published (hanya Published yang masuk ke kuis siswa).
- **Pengaturan & Komposisi Kuis**:
  - Atur total soal per kuis.
  - Atur komposisi jumlah soal mudah, sedang, dan sulit ($Mudah + Sedang + Sulit = Total$).
  - Atur nominal reward koin per jawaban benar.
  - Peringatan otomatis jika bank soal kategori kurang dari komposisi yang ditentukan.
- **Laporan & Hasil Siswa**:
  - Monitoring skor pengerjaan kuis, rata-rata nilai, dan aktivitas siswa.

---

## 🚀 Cara Menjalankan Secara Lokal

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Jalankan Mode Pengembangan
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

> **Catatan Demo Offline:** EduQuest dilengkapi dengan fallback engine dan data seed awal, sehingga seluruh fitur gameplay, kuis, toko koin, kustomisasi karakter, dan panel admin dapat langsung dimainkan dan diuji tanpa konfigurasi database tambahan terlebih dahulu!

---

## 🗄️ Menghubungkan ke Supabase (Backend PostgreSQL)

1. Buat project baru di [Supabase](https://supabase.com/).
2. Buka menu **SQL Editor** di dashboard Supabase.
3. Salin dan jalankan seluruh isi file migrasi yang telah disediakan di:
   ```
   supabase/migrations/20261113000000_eduquest_schema.sql
   ```
   *Skrip ini akan membuat tabel lengkap, relasi, RLS policies, trigger pembuatan profil & inventaris starter, fungsi anti-cheat `start_quiz_session`, `submit_quiz_attempt`, transaksi toko `purchase_item`, serta seed awal data mata pelajaran, kategori pecahan, dan bank soal.*
4. Buat file `.env.local` di folder root dan isi:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Restart aplikasi (`npm run dev`).

---

## 🌐 Deploy ke Netlify

EduQuest sudah dilengkapi file konfigurasi `netlify.toml` dan kompatibel dengan Netlify Next.js runtime.

### Cara Deploy via Git:
1. Push project ini ke repository GitHub/GitLab Anda.
2. Buka [Netlify](https://app.netlify.com/) dan pilih **Add new site > Import an existing project**.
3. Hubungkan repository GitHub Anda.
4. Konfigurasi build otomatis terdeteksi:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Masukkan Environment Variables di Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Klik **Deploy site**.

---

## 📂 Struktur Folder Project

```
EduQuest/
├── public/                     # Aset statis & favicon
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (student)/
│   │   │   ├── home/           # Dashboard siswa
│   │   │   ├── quiz/           # Pemilihan mapel & kuis aktif
│   │   │   ├── character/      # Kamar ganti avatar chibi
│   │   │   ├── shop/           # Toko item kosmetik
│   │   │   └── history/        # Riwayat kuis & skor
│   │   └── admin/              # Panel Guru & Admin
│   │       ├── dashboard/      # Overview & analytics
│   │       ├── subjects/       # CRUD mapel & kategori
│   │       ├── questions/      # Bank soal 4 opsi & kesulitan
│   │       ├── quiz-settings/  # Aturan komposisi kuis
│   │       └── results/        # Rekap hasil belajar siswa
│   ├── components/
│   │   ├── avatar/             # SVG 2D Layered Chibi Character
│   │   └── ui/                 # GameButton, Navbar, Badges
│   ├── lib/
│   │   ├── sounds.ts           # Web Audio SFX (klik, koin, fanfare)
│   │   ├── mockData.ts         # Data awal & benchmark
│   │   └── supabase/           # Client Supabase
│   ├── stores/
│   │   └── useGameStore.ts     # State management Zustand
│   └── types/                  # TypeScript interfaces
├── supabase/
│   └── migrations/             # Migration SQL + RPC anti-cheat
├── netlify.toml                # Konfigurasi deployment Netlify
├── package.json
└── tailwind.config.ts
```

