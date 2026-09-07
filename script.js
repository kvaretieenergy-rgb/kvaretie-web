// =========================================================
// KVARETIE ENERGY SOLUTIONS — Catálogo Digital Interactivo
// =========================================================
(function () {
  "use strict";

  /* ---------- Año en footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú off-canvas ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var offcanvas = document.getElementById("offcanvas");
  var scrim = document.getElementById("scrim");
  var offcanvasClose = document.getElementById("offcanvasClose");

  function openMenu() {
    offcanvas.classList.add("open");
    scrim.classList.add("open");
    menuToggle.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    offcanvas.classList.remove("open");
    scrim.classList.remove("open");
    menuToggle.classList.remove("active");
    document.body.style.overflow = "";
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      offcanvas.classList.contains("open") ? closeMenu() : openMenu();
    });
  }
  if (scrim) scrim.addEventListener("click", closeMenu);
  if (offcanvasClose) offcanvasClose.addEventListener("click", closeMenu);
  document.querySelectorAll(".offcanvas-nav a, .offcanvas .btn").forEach(function (el) {
    el.addEventListener("click", closeMenu);
  });

  /* ---------- Video institucional: click-to-play ---------- */
  document.querySelectorAll("[data-video-wrap]").forEach(function (wrap) {
    var video = wrap.querySelector("video");
    var playBtn = wrap.querySelector(".video-play");
    if (!video || !playBtn) return;
    playBtn.addEventListener("click", function () {
      video.play();
      playBtn.classList.add("hidden");
    });
    video.addEventListener("pause", function () {
      playBtn.classList.remove("hidden");
    });
    video.addEventListener("play", function () {
      playBtn.classList.add("hidden");
    });
    video.addEventListener("ended", function () {
      playBtn.classList.remove("hidden");
    });
  });

  /* ---------- Carrusel de flyers: flechas ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".flyer-track");
    var prev = carousel.querySelector(".carousel-prev");
    var next = carousel.querySelector(".carousel-next");
    if (!track) return;
    function scrollAmount() {
      var item = track.querySelector(".flyer-item");
      var w = item ? item.getBoundingClientRect().width + 16 : 220;
      return w * 2;
    }
    if (prev) prev.addEventListener("click", function () {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });
    if (next) next.addEventListener("click", function () {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
  });

  /* ---------- Lightbox (flyers + galería) ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var currentGroup = [];
  var currentIndex = 0;

  function collectGroup(triggerEl) {
    var groupName = triggerEl.getAttribute("data-lightbox-group");
    var nodes = groupName
      ? document.querySelectorAll('[data-lightbox-group="' + groupName + '"]')
      : [triggerEl];
    return Array.prototype.slice.call(nodes);
  }

  function openLightbox(triggerEl) {
    currentGroup = collectGroup(triggerEl);
    currentIndex = currentGroup.indexOf(triggerEl);
    showLightboxImage();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function showLightboxImage() {
    var el = currentGroup[currentIndex];
    if (!el) return;
    var full = el.getAttribute("data-full") || el.querySelector("img").src;
    lightboxImg.src = full;
    lightboxImg.alt = el.getAttribute("data-alt") || "";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }
  function nextImage() {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + 1) % currentGroup.length;
    showLightboxImage();
  }
  function prevImage() {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    showLightboxImage();
  }

  document.querySelectorAll("[data-lightbox-group]").forEach(function (el) {
    el.addEventListener("click", function () {
      openLightbox(el);
    });
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener("click", prevImage);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var rObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      rObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- Header: sombra al hacer scroll ---------- */
  var header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });
})();
