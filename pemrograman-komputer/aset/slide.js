/* Penggerak presentasi Metode Numerik.
 *
 * Rumus digambar KaTeX SEBELUM Reveal dijalankan. Urutannya penting: Reveal
 * mengukur tinggi tiap slide untuk menyekalakannya, dan kalau rumusnya baru
 * muncul sesudah pengukuran, slide yang padat rumus akan terpotong di bawah.
 */
(function () {
  'use strict';

  function gambarRumus() {
    if (typeof renderMathInElement !== 'function') return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      // Tanpa ini, satu rumus yang salah ketik akan menghentikan seluruh
      // penggambaran dan menyisakan slide setelahnya tanpa rumus sama sekali.
      throwOnError: false,
      errorColor: '#9E2A2B',
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    });
  }

  function jalankanReveal() {
    Reveal.initialize({
      hash: true,              // alamat ikut berubah, jadi satu slide bisa ditautkan
      slideNumber: 'c/t',
      controls: true,
      progress: true,
      // Seluruh slide ditengahkan tegak. Aman: slide isi yang paling tinggi
      // terukur 602 px, sedangkan ruang yang tersedia 655 px, jadi tidak ada
      // yang terpotong. Kalau kelak ada slide yang lebih padat, ukur lagi --
      // dengan center:true, slide yang kelewat tinggi terpotong di ATAS, dan
      // itu tidak kelihatan sampai ada yang menyadarinya di kelas.
      center: true,
      transition: 'slide',
      transitionSpeed: 'fast',
      // Kanvasnya 16:10 (1152 x 720), bukan 16:9, meskipun layarnya 16:9.
      //
      // Reveal menyekalakan kanvas supaya muat seluruhnya, dan karena kanvas
      // ini lebih ramping daripada layarnya, yang membatasi adalah TINGGI.
      // Akibatnya: tinggi terpakai penuh sebagaimana kanvas 16:9, sedangkan
      // di kiri dan kanan tersisa ruang kosong yang seimbang.
      //
      // Itu disengaja. Sebagian proyektor memangkas tepi gambar, dan tepi
      // mendatar yang paling sering kena. Dengan susunan ini, isi slide
      // berhenti jauh sebelum tepi layar: pada proyektor 1920 x 1080, sisa
      // kiri dan kanan masing-masing sekitar 9%, sedangkan atas dan bawah
      // tetap 2%.
      width: 1152,
      height: 720,
      // Cukup 2%, sebab jarak dari tepi mendatar sudah dijamin oleh kanvas
      // 16:10 di atas, bukan oleh angka ini. Pada proyektor 1920 x 1080
      // hasilnya: kiri dan kanan 6,8%, atas dan bawah 2%.
      margin: 0.02,
      minScale: 0.2,
      maxScale: 1.8,
      // Layar sentuh: geser untuk berpindah slide.
      touch: true,
      // Esc membuka peta seluruh slide, S membuka catatan pengajar.
      overview: true
    });
  }

  function siapkanLayarPenuh() {
    var tombol = document.getElementById('layar-penuh');
    if (!tombol) return;

    function sedangPenuh() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function alih() {
      var akar = document.documentElement;
      if (!sedangPenuh()) {
        var minta = akar.requestFullscreen || akar.webkitRequestFullscreen;
        if (minta) minta.call(akar);
      } else {
        var keluar = document.exitFullscreen || document.webkitExitFullscreen;
        if (keluar) keluar.call(document);
      }
    }

    tombol.addEventListener('click', function (e) {
      e.preventDefault();
      alih();
      // Tanpa ini, tombol tetap terpilih dan spasi berikutnya menekannya lagi
      // alih-alih memajukan slide.
      tombol.blur();
    });

    function perbarui() {
      var penuh = sedangPenuh();
      tombol.setAttribute('aria-pressed', penuh ? 'true' : 'false');
      tombol.title = penuh ? 'Keluar dari layar penuh (F)' : 'Layar penuh (F)';
    }
    document.addEventListener('fullscreenchange', perbarui);
    document.addEventListener('webkitfullscreenchange', perbarui);
    perbarui();

    // Reveal sendiri sudah memetakan F ke layar penuh; ini hanya menambahkan
    // Escape supaya keluar tanpa membuka peta slide lebih dahulu.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sedangPenuh()) {
        e.stopPropagation();
        alih();
      }
    }, true);
  }

  /* Reveal menandai slide berlatar gelap pada elemen <section>-nya, bukan pada
     wadah .reveal, sehingga penanda halaman -- yang berada di luar .slides --
     tidak dapat menyesuaikan warnanya lewat CSS saja. Tandanya dipindahkan ke
     <body> setiap kali slide berganti. */
  function ikutiLatar() {
    function perbarui() {
      var s = document.querySelector('.reveal .slides > section.present');
      var gelap = !!(s && s.classList.contains('has-dark-background'));
      document.body.classList.toggle('latar-gelap', gelap);
    }
    Reveal.on('ready', perbarui);
    Reveal.on('slidechanged', perbarui);
    perbarui();
  }

  /* Klik di mana pun pada slide memajukan presentasi, sama seperti tombol
     Next -- tombol panah bawaan Reveal tetap ada dan tetap berfungsi.
     Reveal.next() dipakai, bukan Reveal.right(), supaya fragmen di dalam satu
     slide ikut dijalankan berurutan persis seperti menekan tombolnya.

     Empat keadaan sengaja DIKECUALIKAN, dan tiap pengecualian ada sebabnya:

       - klik selain tombol kiri, supaya menu klik-kanan tidak melompati slide
       - mode peta slide (Esc), sebab di sana klik berarti memilih slide

     Penangannya dipasang pada tahap TANGKAP, bukan tahap gelembung. Sebabnya
     nyata: pada tahap gelembung, penangan Reveal sendiri sudah menutup mode
     peta lebih dahulu, sehingga ketika penjaga di bawah memeriksanya modenya
     sudah tidak aktif lagi -- klik pada peta slide berakibat melompati satu
     slide, bukan memilih slide yang diklik.
       - klik pada tombol, pranala, dan bilah kemajuan, yang sudah punya
         tugasnya sendiri -- tanpa ini, menekan tombol layar penuh akan
         sekaligus memajukan slide
       - ketika ada teks yang sedang disorot, sebab menyorot rumus untuk
         dibacakan tidak boleh berakibat berpindah halaman */
  function siapkanKlikMaju() {
    document.addEventListener('click', function (e) {
      if (e.button !== 0) return;
      if (Reveal.isOverview()) return;
      if (e.target.closest('a, button, input, textarea, select, ' +
                           '.controls, .progress, .slide-number, #layar-penuh')) return;
      var sorot = window.getSelection && window.getSelection().toString();
      if (sorot && sorot.length > 0) return;
      Reveal.next();
    }, true);
  }

  function mulai() {
    gambarRumus();
    jalankanReveal();
    ikutiLatar();
    siapkanLayarPenuh();
    siapkanKlikMaju();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    mulai();
  }
})();
