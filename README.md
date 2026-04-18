# 🕌 Tashrif Master: Leksikon Arab Digital Modern

**Tashrif Master** adalah aplikasi konjugasi kata kerja (tasrif) bahasa Arab tingkat lanjut yang menggabungkan linguistik tradisional dengan kecerdasan buatan (AI) modern. Dirancang untuk pelajar, pengajar, dan pecinta bahasa Arab yang menginginkan akurasi dan kemudahan dalam genggaman.

![Aesthetics](https://img.shields.io/badge/UI-Glassmorphism-emerald)
![Tech](https://img.shields.io/badge/Tech-Next.js%20|%20Supabase-blue)
![AI](https://img.shields.io/badge/AI-OpenAI%20Neural%20Engine-orange)

---

## 🚀 Fitur Utama

### 🧠 Mesin Kecerdasan Leksikon (Neural Engine)
Didukung oleh **OpenAI GPT-4o-mini**, aplikasi ini dapat menganalisis akar kata (wazan) dan memberikan klasifikasi linguistik (Shahih, Mithal, dll) secara otomatis hanya dengan memasukkan kata dasar.

### 🔄 Konjugasi Dinamis
Sistem tasrif otomatis yang mencakup:
- **Fi'il Madhi** (Masa Lampau)
- **Fi'il Mudhari** (Masa Kini/Mendatang)
- **Fi'il Amr** (Kata Perintah)
- **Ringkasan Ishtilahy** (Perubahan bentuk kata)

### ☁️ Sinkronisasi Cloud & Offline-First
Menggunakan kombinasi **Supabase** untuk data cloud dan **Dexie.js (IndexedDB)** untuk penyimpanan lokal. Progres belajar Anda tetap tersimpan meskipun tanpa koneksi internet.

### 🔊 Audio Pronunciation
Dengarkan pelafalan setiap konjugasi secara jernih untuk membantu memperhalus *makhraj* dan hafalan Anda.

### 🌓 Mode Gelap & Estetika Premium
Antarmuka pengguna yang modern dengan efek *glassmorphism*, transisi halus, dan dukungan penuh untuk **Mode Gelap** yang nyaman di mata.

---

## 🛠️ Stack Teknologi

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database Cloud:** [Supabase](https://supabase.com/)
- **Database Lokal:** [Dexie.js](https://dexie.org/)
- **Kecerdasan Buatan:** [OpenAI API](https://openai.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animasi:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 💻 Cara Menjalankan Secara Lokal

1. **Clone Repository:**
   ```bash
   git clone https://github.com/username/tashrif.git
   cd tashrif
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env.local` dan isi dengan kunci API Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   NEXT_PUBLIC_OPENAI_API_KEY="your-openai-key"
   ```

4. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```

---

## 📱 Progressive Web App (PWA)
Aplikasi ini sudah mendukung PWA. Anda dapat menginstalnya di perangkat Android atau iOS sebagai aplikasi "Native" melalui fitur *Add to Home Screen*.

---

dikembangkan dengan ❤️ untuk kemajuan pendidikan bahasa Arab.
