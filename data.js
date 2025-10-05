// data.js — dummy data for kegiatan and FAQ
const KEGIATAN = [
  {
    id: 'k1',
    judul: 'Pelatihan Kepemimpinan Mahasiswa',
    tanggal: '2025-10-15',
    lokasi: 'Aula Utama UIN RF',
    kategori: 'Pelatihan',
  ringkas: 'Pelatihan softskill untuk pengurus IMADIKSI.',
    isi: 'Pelatihan intensif 2 hari tentang kepemimpinan, manajemen organisasi, dan komunikasi efektif.'
  },
  {
    id: 'k2',
    judul: 'Bakti Sosial Donasi Buku',
    tanggal: '2025-11-03',
    lokasi: 'Kampus II',
    kategori: 'Pengabdian',
  ringkas: 'Kegiatan penggalangan buku untuk anak-anak sekolah.',
    isi: 'Pengumpulan dan distribusi buku serta kegiatan membaca bersama anak-anak di panti asuhan.'
  },
  {
    id: 'k3',
    judul: 'Webinar KIP dan Beasiswa',
    tanggal: '2025-09-05',
    lokasi: 'Online (Zoom)',
    kategori: 'Webinar',
    ringkas: 'Informasi terkini mengenai KIP Kuliah dan cara mempertahankan bantuan.',
    isi: 'Pembicara dari biro kemahasiswaan dan alumni penerima KIP berbagi pengalaman dan tips.'
  }
];

const FAQS = [
  { q: 'Apa itu KIP Kuliah?', a: 'KIP Kuliah adalah program bantuan biaya pendidikan bagi siswa/mahasiswa kurang mampu secara ekonomi.' },
  { q: 'Siapa yang berhak menerima KIP?', a: 'Siswa/mahasiswa dari keluarga tidak mampu yang memenuhi kriteria kelayakan yang ditetapkan pemerintah.' },
  { q: 'Bagaimana cara mengajukan aduan ke IMADIKSI?', a: 'Gunakan formulir Aduan/Aspirasi di halaman ini; data disimpan lokal dan tidak dipublikasikan tanpa izin.' },
  { q: 'Apakah ada batas ukuran file untuk lampiran?', a: 'Ya — maksimal 2MB; format yang diterima: PDF, JPG, PNG.' },
  { q: 'Apakah IMADIKSI menyediakan bantuan non-finansial?', a: 'Ya — pendampingan akademik, bimbingan karier, dan pelatihan soft-skill.' },
  { q: 'Bagaimana IMADIKSI menjaga kerahasiaan data?', a: 'Data disimpan lokal pada browser pengguna; organisasi hanya mengakses jika diberi izin oleh pengirim.' }
];

// Sample data for Kader Berprestasi
const KADER = [
  { id: 'kdr1', nama: 'Bastian Dahil', fakultas: 'Hukum Ekonomi Syariah', prestasi: 'Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan', foto: 'assets/foto/kader-berprestasi-1.jpg', deskripsi: 'Selamat Kepada Bastian Danil Atas Prestasinya Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan🥳 Semoga ilmu yang di dapat selalu berkah dan bermanfaat bagi banyak orang✨' },
  { id: 'kdr2', nama: 'Khoiru Nisa', fakultas: 'Sub Bidang Departemen Media', prestasi: 'Juara 3 Lomba Bussines Plan Acara Temu FOSSE Regional Sumbagsel', foto: 'assets/foto/kader-berprestasi-2.jpg', deskripsi: 'Selamat Kepada Khoiru Nisa selaku Sub Bidang Departemen Media 2025-2026 Atas Prestasinya Juara 3 Business Plan🥳 Semoga ilmu yang di dapat selalu berkah dan bermanfaat bagi banyak orang✨' },
  { id: 'kdr3', nama: 'Prengky Aldo', fakultas: 'Anggota Departemen Keagamaan', prestasi: 'Terpilih Sebagai Penulis Buku Nasional Dalam Lomba Menulis Cerpen Dan Puisi Tingkat Nasional 2025 Antologi Puisi Dengan Judul harapan Dan Penantian', foto: 'assets/foto/kader-berprestasi-3.jpg', deskripsi: 'Selamat dan sukses Kepada Prengky Aldo selaku Anggota Departemen Keagamaan 2025-2026 Atas Prestasi yang telah di raih🥳 Semoga ilmu yang di dapat selalu berkah dan bermanfaat bagi banyak orang✨' },
  { id: 'kdr3', nama: 'Bastian Dahil', fakultas: 'Hukum Ekonomi Syariah', prestasi: 'Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan', foto: 'assets/foto/kader-berprestasi-1.jpg', deskripsi: 'Selamat Kepada Bastian Danil Atas Prestasinya Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan🥳 Semoga ilmu yang di dapat selalu berkah dan bermanfaat bagi banyak orang✨' },
  { id: 'kdr3', nama: 'Bastian Dahil', fakultas: 'Hukum Ekonomi Syariah', prestasi: 'Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan', foto: 'assets/foto/kader-berprestasi-1.jpg', deskripsi: 'Selamat Kepada Bastian Danil Atas Prestasinya Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan🥳 Semoga ilmu yang di dapat selalu berkah dan bermanfaat bagi banyak orang✨' },
  { id: 'kdr3', nama: 'Bastian Dahil', fakultas: 'Hukum Ekonomi Syariah', prestasi: 'Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan', foto: 'assets/foto/kader-berprestasi-1.jpg', deskripsi: 'Selamat Kepada Bastian Danil Atas Prestasinya Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan🥳 Semoga ilmu yang di dapat selalu berkah dan bermanfaat bagi banyak orang✨' },
  { id: 'kdr3', nama: 'Bastian Dahil', fakultas: 'Hukum Ekonomi Syariah', prestasi: 'Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan', foto: 'assets/foto/kader-berprestasi-1.jpg', deskripsi: 'Selamat Kepada Bastian Danil Atas Prestasinya Juara 3 Talent Show Dakwah Fest tingkat provinsi Sumatera Selatan🥳 Semoga ilmu yang di dapat selalu berkah dan bermanfaat bagi banyak orang✨' },
  { id: 'kdr4', nama: 'Rina Marlina', fakultas: 'Hukum', prestasi: 'Relawan Hak Asasi Manusia Terbaik 2023', foto: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop&s=3c4d5e', deskripsi: 'Aktif dalam kegiatan sosial dan advokasi mahasiswa.' },
  { id: 'kdr5', nama: 'Rina Marlina', fakultas: 'Hukum', prestasi: 'Relawan Hak Asasi Manusia Terbaik 2023', foto: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop&s=3c4d5e', deskripsi: 'Aktif dalam kegiatan sosial dan advokasi mahasiswa.' },
  { id: 'kdr6', nama: 'Rina Marlina', fakultas: 'Hukum', prestasi: 'Relawan Hak Asasi Manusia Terbaik 2023', foto: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop&s=3c4d5e', deskripsi: 'Aktif dalam kegiatan sosial dan advokasi mahasiswa.' }
];
