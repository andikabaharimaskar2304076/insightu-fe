## 🗓️ **Minggu 1: Setup Proyek & Autentikasi**

🎯 **Fokus:** Persiapan proyek, autentikasi dasar, dan navigasi umum

### ✅ To-Do:
- Inisialisasi project `Next.js` + `Tailwind CSS`
- Setup struktur folder (`pages`, `components`, `services`)
- Buat halaman:
  - Login
  - Register
- Integrasi login/register ke API (pakai JWT)
- Simpan token JWT di `localStorage` atau cookie
- Setup route protection (redirect jika belum login)
- Setup navigasi dasar (navbar dinamis berdasarkan role)

---

## 🗓️ **Minggu 2: Dashboard & Manajemen Role**

🎯 **Fokus:** Dashboard dinamis berdasarkan role pengguna

### ✅ To-Do:
- Buat dashboard khusus:
  - Mahasiswa → lihat profil dan status sesi
  - Psikolog → lihat daftar permintaan sesi masuk
  - Admin → lihat daftar pengguna belum diverifikasi
- Integrasi endpoint `GET /me` untuk menampilkan data pengguna login
- Middleware pengecekan role di setiap route dashboard
- Komponen sidebar/halaman dinamis untuk setiap jenis pengguna

---

## 🗓️ **Minggu 3: Permintaan & Persetujuan Sesi**

🎯 **Fokus:** Fitur permintaan sesi oleh siswa dan tindakan dari psikolog

### ✅ To-Do:
- Mahasiswa:
  - Halaman form permintaan sesi
  - Pilih tanggal, psikolog, dan kirim ke API
- Psikolog:
  - Tampilkan permintaan sesi
  - Tombol **Terima / Tolak**
  - Kirim PATCH status ke API
- Komponen kalender/tanggal (opsional)
- Validasi form

---

## 🗓️ **Minggu 4: Notifikasi & Penyempurnaan**

🎯 **Fokus:** Interaksi pengguna dan perbaikan akhir

### ✅ To-Do:
- Ambil daftar notifikasi dari API
- Tampilkan badge atau alert baru jika ada notifikasi
- Tambah fitur tandai notifikasi sebagai sudah dibaca
- UI polishing:
  - Responsif untuk mobile
  - Error handling
  - Loading state
- Tes end-to-end semua alur (login → dashboard → sesi → notifikasi)
- Finalisasi dan dokumentasi `.env`, struktur folder, dan cara deploy