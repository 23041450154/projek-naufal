// script.js — behavior for the IMADIKSI single-page site
// Implements dynamic rendering from data.js, form handling, modals, toasts, search/filter, and utilities.

(function () {
  // Utilities
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Elements
  const kegiatanGrid = $('#kegiatan-grid');
  const faqList = $('#faq-list');
  const yearSpan = $('#year');
  const backToTop = $('#back-to-top');
  const modalRoot = $('#modal-root');
  const toastRoot = $('#toast-root');
  const header = $('#header');

  // State
  let kegiatan = typeof KEGIATAN !== 'undefined' ? KEGIATAN.slice() : [];
  let filters = { q: '', category: '', month: '' };

  // Accessibility: set year
  yearSpan.textContent = new Date().getFullYear();

  // NAV mobile toggle
  const navToggle = $('#nav-toggle');
  const mobileMenu = $('#mobile-menu');
  navToggle?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('hidden') === false;
    navToggle.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  });

  // Shrink navbar when scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 50) header.classList.add('shadow-md'); else header.classList.remove('shadow-md');
    if (y > 300) backToTop.classList.remove('hidden'); else backToTop.classList.add('hidden');
    lastScroll = y;
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Render kegiatan grid
  function renderKegiatanList() {
    // filter
    const list = kegiatan.filter(k => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!(k.judul.toLowerCase().includes(q) || k.ringkas.toLowerCase().includes(q))) return false;
      }
      if (filters.category && k.kategori !== filters.category) return false;
      if (filters.month) {
        const m = new Date(k.tanggal).getMonth() + 1;
        if (String(m) !== String(filters.month)) return false;
      }
      return true;
    });

    kegiatanGrid.innerHTML = '';
    if (list.length === 0) {
      kegiatanGrid.innerHTML = '<p class="text-sm text-gray-600">Tidak ada kegiatan sesuai filter.</p>';
      return;
    }

    list.forEach(k => {
      const card = document.createElement('article');
      card.className = 'p-4 border rounded-lg bg-white shadow-sm';
      card.innerHTML = `
        <h3 class="font-semibold text-brand-700">${escapeHtml(k.judul)}</h3>
        <p class="text-sm text-gray-600 mt-1">${formatDate(k.tanggal)} • ${escapeHtml(k.lokasi)}</p>
        <p class="mt-2 text-sm text-gray-700">${escapeHtml(k.ringkas)}</p>
        <div class="mt-4 flex justify-end"><button data-id="${k.id}" class="detail-btn bg-brand-500 text-white px-3 py-1 rounded-md">Detail</button></div>
      `;
      kegiatanGrid.appendChild(card);
    });

  

    // attach detail handlers
    $$('.detail-btn', kegiatanGrid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openKegiatanModal(id);
      });
    });
  }

  // Escape to prevent XSS (use textContent when inserting real nodes)
  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function formatDate(d) {
    try { return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  }

  // Modal for kegiatan detail
  function openKegiatanModal(id) {
    const k = kegiatan.find(x => x.id === id);
    if (!k) return;
    modalRoot.innerHTML = '';
    const dlg = document.createElement('div');
    dlg.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    dlg.innerHTML = `
      <div class="absolute inset-0 bg-black/50" tabindex="-1"></div>
      <div role="dialog" aria-modal="true" class="relative bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg">
        <button id="close-modal" class="absolute top-3 right-3 text-gray-500">×</button>
        <h3 class="text-xl font-bold text-brand-700">${escapeHtml(k.judul)}</h3>
        <p class="text-sm text-gray-600">${formatDate(k.tanggal)} • ${escapeHtml(k.lokasi)} • ${escapeHtml(k.kategori)}</p>
        <div class="mt-4 text-gray-700">${escapeHtml(k.isi)}</div>
      </div>
    `;
    modalRoot.appendChild(dlg);

    // close handlers
    $('#close-modal', dlg).addEventListener('click', closeModal);
    dlg.querySelector('.absolute').addEventListener('click', closeModal);
    document.addEventListener('keydown', escClose);

    function closeModal() { modalRoot.innerHTML = ''; document.removeEventListener('keydown', escClose); }
    function escClose(e) { if (e.key === 'Escape') closeModal(); }
  }

  // Toast
  function toast(message, opts = {}) {
    const t = document.createElement('div');
    t.className = 'bg-brand-500 text-white px-4 py-2 rounded-md shadow-lg mb-2';
    t.textContent = message;
    toastRoot.appendChild(t);
    setTimeout(() => t.remove(), opts.duration || 800);
  }

  // Render FAQ accordion
  function renderFaqs() {
    if (typeof FAQS === 'undefined') return;
    faqList.innerHTML = '';
    FAQS.forEach((f, i) => {
      const item = document.createElement('div');
      item.className = 'border rounded-md bg-white';
      item.innerHTML = `
        <button class="w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none" aria-expanded="false">
          <span class="font-medium">${escapeHtml(f.q)}</span>
          <span class="chev">+</span>
        </button>
        <div class="px-4 pb-3 hidden text-gray-700">${escapeHtml(f.a)}</div>
      `;
      const btn = item.querySelector('button');
      const panel = item.querySelector('div');
      btn.addEventListener('click', () => {
        const open = panel.classList.toggle('hidden') === false;
        btn.setAttribute('aria-expanded', open);
        btn.querySelector('.chev').textContent = open ? '−' : '+';
      });
      faqList.appendChild(item);
    });
  }

  // Populate filter options from categories and months
  function populateFilters() {
    const catSel = $('#filter-category');
    const monthSel = $('#filter-month');
    const cats = Array.from(new Set(kegiatan.map(k => k.kategori))).sort();
    cats.forEach(c => {
      const opt = document.createElement('option'); opt.value = c; opt.textContent = c; catSel.appendChild(opt);
    });
    const months = Array.from(new Set(kegiatan.map(k => new Date(k.tanggal).getMonth() + 1))).sort();
    months.forEach(m => { const opt = document.createElement('option'); opt.value = m; opt.textContent = new Date(2020, m-1).toLocaleString('id-ID', { month: 'long' }); monthSel.appendChild(opt); });
  }

  // Search and filter handlers
  $('#search').addEventListener('input', (e) => { filters.q = e.target.value; renderKegiatanList(); });
  $('#filter-category').addEventListener('change', (e) => { filters.category = e.target.value; renderKegiatanList(); });
  $('#filter-month').addEventListener('change', (e) => { filters.month = e.target.value; renderKegiatanList(); });

  // Form handling: aduan
  const form = $('#aduan-form');
  const submitBtn = $('#submit-btn');
  const exportBtn = $('#export-csv');

  function readStored() {
    try { return JSON.parse(localStorage.getItem('imadiksi_aduan') || '[]'); } catch { return []; }
  }

  function saveStored(items) { localStorage.setItem('imadiksi_aduan', JSON.stringify(items)); }

  function validateFile(file) {
    if (!file) return { ok: true };
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowed.includes(file.type)) return { ok: false, reason: 'Tipe file tidak didukung.' };
    if (file.size > 2 * 1024 * 1024) return { ok: false, reason: 'Ukuran file melebihi 2MB.' };
    return { ok: true };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // simple front-end validation
    const f = new FormData(form);
    const nama = (f.get('nama') || '').toString().trim();
    const nim = (f.get('nim') || '').toString().trim();
    const email = (f.get('email') || '').toString().trim();
    const pesan = (f.get('pesan') || '').toString().trim();
    const metode = (f.get('metode') || 'email').toString().trim();
    const agree = f.get('agree');
    const file = f.get('file');

    if (!nama || !nim || !email || !pesan || !kategori) return showFormStatus('Lengkapi semua field bertanda *', true);
    if (!/^[0-9]+$/.test(nim)) return showFormStatus('NIM harus berupa angka.', true);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showFormStatus('Email tidak valid.', true);
    if (!agree) return showFormStatus('Anda harus menyetujui persetujuan.', true);
    const vf = validateFile(file && file.size ? file : null);
    if (!vf.ok) return showFormStatus(vf.reason, true);

    // loading state
    submitBtn.disabled = true; submitBtn.textContent = 'Mengirim...';

    // optional: read file as base64 to store locally (if present)
    let fileData = null;
    if (file && file.size) {
      fileData = await readFileAsDataURL(file).catch(() => null);
    }

    // store
  const items = readStored();
  const item = { id: 'a' + Date.now(), nama, nim, prodi: f.get('prodi') || '', email, metode, pesan, file: fileData, createdAt: new Date().toISOString() };
  items.push(item); saveStored(items);
    // handle delivery method
    try {
      if (metode === 'whatsapp') {
        // forced WhatsApp redirection per user request to wa.me/62857894390567
        const targetPhone = '62857894390567';
        const msg = `Aduan/Aspirasi dari ${nama} (NIM: ${nim}):\n\n${pesan}`;
        const encoded = encodeURIComponent(msg);
        window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank');
        showFormStatus('Terkirim lokal. Membuka WhatsApp...');
        toast('Aduan tersimpan (lokal). Membuka WhatsApp.');
      } else {
        // email path: attempt to send via configured endpoint/EmailJS/mailto
        showFormStatus('Terkirim. Mengirim notifikasi email...');
        const res = await sendEmail(item);
        if (res && res.ok) {
          showFormStatus('Terkirim. Notifikasi email berhasil dikirim.');
          toast('Aduan tersimpan (lokal) dan dikirim via email.');
        } else {
          const errMsg = res && res.error ? res.error : 'Gagal mengirim email.';
          showFormStatus('Terkirim lokal. ' + errMsg, true);
          toast('Aduan tersimpan (lokal). Gagal mengirim email.');
        }
      }
    } catch (err) {
      showFormStatus('Terkirim lokal. Gagal saat mengirim notifikasi.', true);
      toast('Aduan tersimpan (lokal). Terjadi kesalahan saat mengirim notifikasi.');
    } finally {
      submitBtn.disabled = false; submitBtn.textContent = 'Kirim';
      form.reset();
    }
  });

  function showFormStatus(msg, isError = false) {
    const el = $('#form-status');
    el.textContent = msg;
    el.className = isError ? 'text-sm text-red-600' : 'text-sm text-brand-600';
  }

  function readFileAsDataURL(file) {
    return new Promise((res, rej) => {
      const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file);
    });
  }

  // Export CSV
  exportBtn.addEventListener('click', () => {
    const items = readStored();
    if (!items.length) return showFormStatus('Tidak ada data untuk diexport.', true);
    const header = ['id','nama','nim','prodi','email','kategori','pesan','createdAt'];
    const rows = items.map(it => header.map(h => `"${(it[h] || '').toString().replace(/"/g,'""')}"`).join(','));
    const csv = [header.join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'imadiksi_aduan.csv'; a.click(); URL.revokeObjectURL(url);
    showFormStatus('Export CSV siap diunduh.');
  });

  // CSV import / sample load omitted (not requested)

  // Email sending helper
  // Behavior: try a configured server webhook (IMADIKSI_CONFIG.emailEndpoint).
  // If not provided, optionally try EmailJS (IMADIKSI_CONFIG.emailjs) when the EmailJS SDK is loaded.
  // As a last resort, open a mailto: link (attachment not included). This is a best-effort client-side implementation;
  // for reliable delivery and attachments, provide a server endpoint that accepts JSON (see README).
  async function sendEmail(item) {
    const cfg = window.IMADIKSI_CONFIG || {};
    const recipient = (cfg.recipient || '23041450154@radenfatah.ac.id');

    // 1) Try configured server endpoint
    if (cfg.emailEndpoint) {
      try {
        const resp = await fetch(cfg.emailEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: recipient, item })
        });
        if (resp.ok) return { ok: true };
        const text = await resp.text().catch(() => '');
        return { ok: false, error: `Endpoint responded ${resp.status} ${text}` };
      } catch (err) {
        return { ok: false, error: err && err.message ? err.message : String(err) };
      }
    }

    // 2) Try EmailJS if configured and SDK loaded
    if (cfg.emailjs && window.emailjs) {
      try {
        const params = {
          to_email: recipient,
          subject: `Aduan IMADIKSI: ${item.kategori}`,
          message: item.pesan,
          nama: item.nama,
          nim: item.nim,
          prodi: item.prodi || '',
          kategori: item.kategori,
          email: item.email,
          createdAt: item.createdAt
        };
        await window.emailjs.send(cfg.emailjs.serviceId, cfg.emailjs.templateId, params, cfg.emailjs.userId);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err && err.message ? err.message : String(err) };
      }
    }

    // 3) Fallback: open mailto (note: attachments won't be included)
    try {
      const body = `Nama: ${item.nama}\nNIM: ${item.nim}\nProdi: ${item.prodi || ''}\nEmail: ${item.email}\nKategori: ${item.kategori}\n\nPesan:\n${item.pesan}\n\nTerkirim: ${item.createdAt}\n\n(Attachment tidak termasuk; gunakan endpoint server untuk mengirim file)`;
      const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent('Aduan IMADIKSI')}&body=${encodeURIComponent(body)}`;
      // open mail client in a non-blocking way
      window.location.href = mailto;
      return { ok: true, note: 'mailto' };
    } catch (err) {
      return { ok: false, error: err && err.message ? err.message : String(err) };
    }
  }

  // Helpers: escape in text nodes only when needed — above used for HTML insertion

  // load initial
  function init() {
    populateFilters();
    renderKegiatanList();
    renderFaqs();
    initSlideshow();
    renderKaderList();
    // deep links: focusable sections
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) { e.preventDefault(); el.focus({ preventScroll: true }); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' }); }
      });
    });

    // focus outlines for keyboard users
    document.body.addEventListener('keyup', (e) => { if (e.key === 'Tab') document.body.classList.add('user-is-tabbing'); });
  }

  // toggle WA number input when metode changes
  const metodeSel = document.getElementById('metode-pengiriman');
  const waRow = document.getElementById('wa-number-row');
  if (metodeSel && waRow) {
    metodeSel.addEventListener('change', (e) => {
      if (e.target.value === 'whatsapp') waRow.classList.remove('hidden'); else waRow.classList.add('hidden');
    });
  }

  // Render Kader Berprestasi
  function renderKaderList() {
    const root = document.getElementById('kader-carousel');
    if (!root || typeof KADER === 'undefined') return;
    root.innerHTML = '';
    KADER.forEach(k => {
      const card = document.createElement('article');
      card.className = 'kader-card p-4 border rounded-lg bg-white shadow-sm flex flex-col';
      card.innerHTML = `
        <div class="overflow-hidden rounded-md">
          <img src="${escapeHtml(k.foto)}" alt="Foto ${escapeHtml(k.nama)}" />
        </div>
        <div class="flex-1 mt-3">
          <h3 class="font-semibold text-brand-700">${escapeHtml(k.nama)}</h3>
          <p class="text-sm text-gray-600">${escapeHtml(k.fakultas)}</p>
          <p class="mt-2 text-sm text-gray-700">${escapeHtml(k.prestasi)}</p>
        </div>
        <div class="mt-4 flex justify-end items-center">
          <button data-id="${k.id}" class="kader-detail-btn bg-brand-500 text-white px-3 py-1 rounded-md">Detail</button>
        </div>
      `;
      root.appendChild(card);
    });

    // detail handlers
    $$('.kader-detail-btn', root).forEach(btn => btn.addEventListener('click', (e) => openKaderModal(e.currentTarget.dataset.id)));

    // carousel auto-scroll
    setupKaderCarousel(root);
  }

  function openKaderModal(id) {
    const k = (typeof KADER !== 'undefined') ? KADER.find(x => x.id === id) : null;
    if (!k) return;
    modalRoot.innerHTML = '';
    const dlg = document.createElement('div');
    dlg.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    dlg.innerHTML = `
      <div class="absolute inset-0 bg-black/50" tabindex="-1"></div>
      <div role="dialog" aria-modal="true" class="relative bg-white rounded-lg max-w-xl w-full p-6 shadow-lg">
        <button id="close-kader-modal" class="absolute top-3 right-3 text-gray-500">×</button>
        <h3 class="text-xl font-bold text-brand-700">${escapeHtml(k.nama)}</h3>
        <p class="text-sm text-gray-600">${escapeHtml(k.fakultas)} • ${escapeHtml(k.prestasi)}</p>
        <div class="mt-4 text-gray-700">${escapeHtml(k.deskripsi)}</div>
      </div>
    `;
    modalRoot.appendChild(dlg);
    $('#close-kader-modal', dlg).addEventListener('click', () => modalRoot.innerHTML = '');
    dlg.querySelector('.absolute').addEventListener('click', () => modalRoot.innerHTML = '');
    document.addEventListener('keydown', function escK(e) { if (e.key === 'Escape') { modalRoot.innerHTML = ''; document.removeEventListener('keydown', escK); } });
  }

  function openKaderPhoto(id) {
    const k = (typeof KADER !== 'undefined') ? KADER.find(x => x.id === id) : null;
    if (!k) return;
    modalRoot.innerHTML = '';
    const dlg = document.createElement('div');
    dlg.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    dlg.innerHTML = `
      <div class="absolute inset-0 bg-black/70" tabindex="-1"></div>
      <div role="dialog" aria-modal="true" class="relative bg-white rounded-lg max-w-3xl w-full p-4 shadow-lg">
        <button id="close-photo-modal" class="absolute top-3 right-3 text-gray-500">×</button>
        <img src="${escapeHtml(k.foto)}" alt="Foto ${escapeHtml(k.nama)}" class="w-full h-80 object-cover rounded-md" />
        <h3 class="mt-4 text-lg font-bold text-brand-700">${escapeHtml(k.nama)}</h3>
        <p class="text-sm text-gray-600">${escapeHtml(k.fakultas)} • ${escapeHtml(k.prestasi)}</p>
      </div>
    `;
    modalRoot.appendChild(dlg);
    $('#close-photo-modal', dlg).addEventListener('click', () => modalRoot.innerHTML = '');
    dlg.querySelector('.absolute').addEventListener('click', () => modalRoot.innerHTML = '');
    document.addEventListener('keydown', function escP(e) { if (e.key === 'Escape') { modalRoot.innerHTML = ''; document.removeEventListener('keydown', escP); } });
  }

  // Carousel controls & auto-scroll
  function setupKaderCarousel(root) {
    if (!root) return;
    let auto = null;
    let dir = 1; // 1 = right, -1 = left
    const amount = () => Math.max(root.clientWidth * 0.6, 200);

    function tick() {
      // determine if we need to reverse direction
      const maxScroll = root.scrollWidth - root.clientWidth;
      if (root.scrollLeft >= maxScroll - 2) dir = -1;
      if (root.scrollLeft <= 2) dir = 1;
      root.scrollBy({ left: amount() * dir, behavior: 'smooth' });
    }

    function start() { stop(); auto = setInterval(tick, 3000); }
    function stop() { if (auto) { clearInterval(auto); auto = null; } }

    // pause on user interaction
    root.addEventListener('mouseenter', stop);
    root.addEventListener('focusin', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusout', start);

    // respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // start auto-scroll
    start();
  }

  // Slideshow: background images behind hero
  function initSlideshow() {
    const slidesRoot = document.getElementById('slides');
    if (!slidesRoot) return;
    const slides = Array.from(slidesRoot.querySelectorAll('.slide'));
    // preload and set style
    slides.forEach(s => {
      const src = s.dataset.src;
      if (src) {
        const img = new Image(); img.src = src; img.onload = () => { s.style.backgroundImage = `url('${src}')`; };
      }
    });

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // don't auto-animate

    let idx = slides.findIndex(s => s.classList.contains('active'));
    if (idx < 0) idx = 0;
    const interval = 6000; // 6s
    setInterval(() => {
      const prev = slides[idx];
      prev.classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, interval);
  }

  init();

})();

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("#primary-menu .menu-link");

  function onScroll() {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // offset biar pas
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll(); // panggil sekali biar pas saat load
});


// if (window.location.hash === "#beranda") {
//   window.scrollTo({ top: 0, behavior: "instant" });
// }
