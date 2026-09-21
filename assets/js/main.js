/* KVARETIE Energy Solutions — interacciones del sitio */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var drawer = document.querySelector("[data-mobile-drawer]");
  var closeBtn = document.querySelector("[data-menu-close]");

  function openDrawer() {
    if (!drawer) return;
    drawer.setAttribute("data-open", "true");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.setAttribute("data-open", "false");
    document.body.style.overflow = "";
  }
  if (toggle) toggle.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (drawer) {
    var backdrop = drawer.querySelector(".backdrop");
    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  /* ---------- Header: cambia de estilo al hacer scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScrollHeader = function () {
      if (window.scrollY > 12) header.style.borderBottomColor = "rgba(255,255,255,.16)";
      else header.style.borderBottomColor = "rgba(255,255,255,.08)";
    };
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------- Revelado suave al hacer scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Galería: filtros ---------- */
  var filterBtns = document.querySelectorAll("[data-gfilter]");
  var galleryItems = document.querySelectorAll("[data-gitem]");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      var cat = btn.getAttribute("data-gfilter");
      galleryItems.forEach(function (item) {
        var match = cat === "todos" || item.getAttribute("data-cat") === cat;
        item.hidden = !match;
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox && galleryItems.length) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector("figcaption");
    var visibleList = [];
    var currentIndex = 0;

    function refreshVisible() {
      visibleList = Array.prototype.filter.call(galleryItems, function (it) { return !it.hidden; });
    }

    function openLightbox(item) {
      refreshVisible();
      currentIndex = visibleList.indexOf(item);
      renderLightbox();
      lightbox.setAttribute("data-open", "true");
      document.body.style.overflow = "hidden";
    }
    function renderLightbox() {
      var item = visibleList[currentIndex];
      if (!item) return;
      var full = item.getAttribute("data-full");
      var label = item.getAttribute("data-label") || "";
      lbImg.setAttribute("src", full);
      lbImg.setAttribute("alt", label);
      lbCaption.textContent = label;
    }
    function closeLightbox() {
      lightbox.setAttribute("data-open", "false");
      document.body.style.overflow = "";
      lbImg.setAttribute("src", "");
    }
    function step(dir) {
      if (!visibleList.length) return;
      currentIndex = (currentIndex + dir + visibleList.length) % visibleList.length;
      renderLightbox();
    }

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () { openLightbox(item); });
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(item); }
      });
    });

    var lbClose = lightbox.querySelector(".lb-close");
    var lbPrev = lightbox.querySelector(".lb-prev");
    var lbNext = lightbox.querySelector(".lb-next");
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    if (lbPrev) lbPrev.addEventListener("click", function () { step(-1); });
    if (lbNext) lbNext.addEventListener("click", function () { step(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.getAttribute("data-open") !== "true") return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- Visor de proceso (Ejecución: del inicio a la entrega) ---------- */
  var procModal = document.querySelector("[data-proc-modal]");
  if (procModal) {
    var pmImg = procModal.querySelector("img");
    var pmTitle = procModal.querySelector(".proc-modal-title");
    var pmCaption = procModal.querySelector(".proc-modal-caption");
    var pmCounter = procModal.querySelector(".proc-modal-counter");
    var procSlides = [];
    var procIndex = 0;

    function renderProc() {
      var s = procSlides[procIndex];
      if (!s) return;
      pmImg.setAttribute("src", s.full);
      pmImg.setAttribute("alt", s.caption);
      pmCaption.textContent = s.caption;
      pmCounter.textContent = (procIndex + 1) + " / " + procSlides.length;
    }
    function openProc(card) {
      var titleEl = card.querySelector(".proc-title");
      pmTitle.textContent = titleEl ? titleEl.textContent : "";
      var slideEls = card.querySelectorAll(".proc-slides > div");
      procSlides = Array.prototype.map.call(slideEls, function (el) {
        return { full: el.getAttribute("data-full"), caption: el.getAttribute("data-caption") || "" };
      });
      if (!procSlides.length) return;
      procIndex = 0;
      renderProc();
      procModal.setAttribute("data-open", "true");
      document.body.style.overflow = "hidden";
    }
    function closeProc() {
      procModal.setAttribute("data-open", "false");
      document.body.style.overflow = "";
      pmImg.setAttribute("src", "");
    }
    function stepProc(dir) {
      if (!procSlides.length) return;
      procIndex = (procIndex + dir + procSlides.length) % procSlides.length;
      renderProc();
    }
    document.querySelectorAll("[data-proc-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".proc-card");
        if (card) openProc(card);
      });
    });
    var pmClose = procModal.querySelector(".lb-close");
    var pmPrev = procModal.querySelector(".lb-prev");
    var pmNext = procModal.querySelector(".lb-next");
    if (pmClose) pmClose.addEventListener("click", closeProc);
    if (pmPrev) pmPrev.addEventListener("click", function () { stepProc(-1); });
    if (pmNext) pmNext.addEventListener("click", function () { stepProc(1); });
    procModal.addEventListener("click", function (e) { if (e.target === procModal) closeProc(); });
    document.addEventListener("keydown", function (e) {
      if (procModal.getAttribute("data-open") !== "true") return;
      if (e.key === "Escape") closeProc();
      if (e.key === "ArrowLeft") stepProc(-1);
      if (e.key === "ArrowRight") stepProc(1);
    });
  }

  /* ---------- Año dinámico en footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
