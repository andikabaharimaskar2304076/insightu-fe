# ✅ To-Do List Front-End – InsightU (Next.js + Tailwind)

## 🧱 1. **Setup Proyek**

**Tujuan:** Menyiapkan proyek dan konfigurasi awal

* [ ] Inisialisasi proyek dengan `create-next-app`
* [ ] Konfigurasi **Tailwind CSS**
* [ ] Struktur folder: `pages/`, `components/`, `utils/`, `services/`
* [ ] Setup file `.env.local` untuk base URL API
* [ ] Install Axios / Fetch wrapper untuk komunikasi API

---

## 🔐 2. **Autentikasi Pengguna**

**Tujuan:** Registrasi, login, dan pengecekan peran pengguna

* [ ] Halaman Register
* [ ] Halaman Login
* [ ] Simpan token JWT di `localStorage` atau cookie
* [ ] Middleware/guard route: redirect jika belum login
* [ ] Implementasi pengecekan role (`student`, `psychologist`, `admin`)
* [ ] Logout (hapus token)

---

## 📋 3. **Dashboard Berdasarkan Role**

**Tujuan:** Menampilkan dashboard sesuai jenis pengguna

* [ ] Mahasiswa:

  * [ ] Tampilkan info profil (nama, sekolah, kelas)
  * [ ] Tampilkan daftar sesi yang pernah diminta
* [ ] Psikolog:

  * [ ] Tampilkan sesi masuk dari mahasiswa
  * [ ] Aksi: setujui/tolak sesi
* [ ] Admin:

  * [ ] Tampilkan daftar akun belum diverifikasi
  * [ ] Tombol verifikasi akun

---

## 🗓️ 4. **Formulir Permintaan Sesi (Mahasiswa)**

**Tujuan:** Mahasiswa memilih jadwal dan membuat permintaan sesi

* [ ] Halaman/form permintaan sesi
* [ ] Ambil daftar psikolog dari API
* [ ] Pilih tanggal/waktu sesi
* [ ] Kirim ke API

---

## 📬 5. **Respon Sesi (Psikolog)**

**Tujuan:** Psikolog menerima/menolak sesi yang masuk

* [ ] Tampilkan daftar sesi masuk (pending)
* [ ] Tombol **Terima** / **Tolak**
* [ ] Kirim perubahan status ke API
* [ ] Tampilkan konfirmasi atau notifikasi berhasil

---

## 🔔 6. **Sistem Notifikasi**

**Tujuan:** Menampilkan notifikasi kepada pengguna

* [ ] Ambil notifikasi dari API
* [ ] Tampilkan di dashboard atau badge ikon
* [ ] Tandai notifikasi sudah dibaca

---

## ⚙️ 7. **Komponen & Utilitas**

**Tujuan:** Kode lebih modular dan reusable

* [ ] Navbar (otomatis berubah sesuai role)
* [ ] Sidebar (khusus psikolog/admin)
* [ ] Komponen Form input (reusable)
* [ ] Komponen notifikasi / alert
* [ ] Fungsi `axiosInstance` dengan token interceptor

---

## 🧪 8. **Testing & Penyempurnaan**

**Tujuan:** Memastikan semua fitur berfungsi dengan baik

* [ ] Cek login dan register (token tersimpan)
* [ ] Cek routing role-based
* [ ] Tes form sesi dan alur approval
* [ ] Cek integrasi API
* [ ] Responsif di mobile & desktop