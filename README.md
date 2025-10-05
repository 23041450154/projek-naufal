# IMADIKSI UIN RF — Static Website

Situs statis single-page untuk "Ikatan Mahasiswa Bidikmisi UIN Raden Fatah Palembang (IMADIKSI)".

Fitur utama:
- Navbar sticky dan shrink
- Hero dengan CTA
- Bagian "Tentang KIP"
- Kegiatan (dihasilkan dari `data.js`) dengan modal detail, pencarian dan filter
- Form Aduan/Aspirasi (validasi front-end, simpan ke localStorage, export CSV)
- FAQ accordion (dari `data.js`)
- Kontak + peta embed
- Tombol kembali ke atas, deep links, smooth scroll

Cara menjalankan:
1. Buka file `index.html` di browser (cukup buka dengan klik dua kali atau Open With).

Tip pengembangan:
- `data.js` berisi konstanta `KEGIATAN` dan `FAQS` yang dipakai `script.js`.
- `script.js` menangani rendering, validasi, penyimpanan lokal, dan interaksi UI.

Catatan teknis:
- Tailwind CDN digunakan untuk styling (mobile-first). Sesuaikan konfigurasi warna di head `index.html`.
- Semua data aduan disimpan di localStorage key `imadiksi_aduan`.

Email / delivery configuration
-----------------------------
The front-end saves submissions locally and can attempt to notify an email address automatically. There are three delivery options (choose one):

1) Server webhook (recommended)
- Provide a small server endpoint that accepts POST JSON and sends the email (including attachments). Example payload: `{ to, item }` where `item` is the saved aduan object.
- Configure the endpoint by adding a global config before `script.js` loads, for example in `index.html` just above the `<script src="script.js" defer></script>` line:

```html
<script>
	window.IMADIKSI_CONFIG = {
		emailEndpoint: 'https://example.com/imaduksi/send-email', // replace with your server
		recipient: '23041450154@radenfatah.ac.id'
	};
</script>
```

2) EmailJS (client-side third-party)
- If you prefer a serverless approach, you can use EmailJS (https://www.emailjs.com/). Follow EmailJS docs to create a service, template and user ID.
- Then configure:

```html
<script>
	window.IMADIKSI_CONFIG = {
		recipient: '23041450154@radenfatah.ac.id',
		emailjs: { serviceId: 'your_service', templateId: 'your_template', userId: 'your_user' }
	};
</script>
<!-- include EmailJS SDK (per their docs) before script.js -->
<script src="https://cdn.emailjs.com/sdk/3.2.0/email.min.js"></script>
<script>emailjs.init('your_user');</script>
```

3) Mail client fallback
- If no endpoint or EmailJS is configured, the client attempts to open the user's mail client (mailto:). Attachments won't be included with this method.

Security note: Client-side email sending is not reliable for attachments or guaranteed deliverability. For production use create a simple server webhook that accepts the form data and sends email securely from the server.

Additional pages
----------------
- `kegiatan.html`: menampilkan semua kegiatan dengan foto, tanggal, lokasi, dan deskripsi.
- `kader.html`: menampilkan daftar lengkap kader berprestasi dengan foto dan deskripsi.

WhatsApp behavior
-----------------
Per permintaan, ketika pengguna memilih "Hubungi via WhatsApp" form akan mengarahkan ke `https://wa.me/62857894390567` dengan pesan berisi isi aspirasi. Pastikan nomor tersebut sesuai kebutuhan organisasi.
