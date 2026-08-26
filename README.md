# Profil — Dr. Mohammad Jamhuri, M.Si

Halaman profil akademik statis (HTML+CSS murni, tanpa build step), siap dipublikasikan lewat GitHub Pages.

## Cara publish ke GitHub Pages

1. Buat repository baru di GitHub. Untuk domain bawaan `USERNAME.github.io`, beri nama repo persis `USERNAME.github.io` (ganti `USERNAME` dengan username GitHub-mu). Kalau ingin URL bertipe `USERNAME.github.io/nama-repo`, boleh pakai nama bebas, misalnya `profil-jamhuri`.

2. Upload `index.html` ini ke root repo tersebut (bukan di dalam folder). Bisa lewat web GitHub (tombol "Add file → Upload files") atau lewat git:

   ```bash
   git init
   git add index.html README.md
   git commit -m "Publish halaman profil"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```

3. Di GitHub, buka repo → **Settings → Pages**. Pada bagian **Build and deployment**, pilih:
   - Source: `Deploy from a branch`
   - Branch: `main`, folder `/ (root)`
   
   Klik **Save**.

4. Tunggu 1–2 menit, lalu halaman akan aktif di:
   - `https://USERNAME.github.io/` (jika nama repo `USERNAME.github.io`), atau
   - `https://USERNAME.github.io/NAMA-REPO/` (jika nama repo bebas)

## Catatan

- File ini murni statis (tidak butuh Node/build tool apa pun), jadi kompatibel langsung dengan GitHub Pages tanpa konfigurasi tambahan.
- Font dimuat dari Google Fonts CDN — pastikan koneksi tidak memblokir `fonts.googleapis.com` saat halaman dibuka.
- Untuk update data (publikasi baru, buku baru, dll), cukup edit `index.html` langsung lalu `git push` lagi — GitHub Pages otomatis re-deploy dalam waktu singkat.
