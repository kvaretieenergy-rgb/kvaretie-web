/* Social links that work from in-app browsers (Instagram, Facebook, TikTok…).
 * Normal browsers: links are left untouched (the OS opens the app via its universal/app link).
 * In-app browsers: links to another platform try to leave the embedded browser
 * (Android: intent:// hands the URL to the TikTok/Instagram/Facebook app or the default browser;
 * iOS: offers Safari via x-safari-https://). A small panel always offers
 * "Abrir en navegador", "Copiar enlace" and "Compartir" so the visitor is never stuck.
 * Platforms can still block any of these; the panel's copy option is the guaranteed fallback. */
(function () {
  'use strict';
  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var host = /Instagram/i.test(ua) ? 'instagram'
    : /FBAN|FBAV|FB_IAB|FB4A|FBIOS|MessengerForiOS|Messenger/i.test(ua) ? 'facebook'
    : /musical_ly|BytedanceWebview|TikTok|trill_/i.test(ua) ? 'tiktok'
    : /Threads|Barcelona|LinkedInApp|Snapchat|Line\/|Twitter/i.test(ua) ? 'other' : '';
  var NAMES = { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', web: 'la página' };

  function platformOf(url) {
    var h = url.hostname.replace(/^www\.|^m\.|^web\./, '');
    if (/(^|\.)tiktok\.com$/.test(h)) return 'tiktok';
    if (/(^|\.)instagram\.com$/.test(h)) return 'instagram';
    if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(h)) return 'facebook';
    return '';
  }
  function androidIntent(url) {
    var u = new URL(url);
    return 'intent://' + u.host + u.pathname + u.search + u.hash.replace(/#/g, '%23') +
      '#Intent;scheme=' + u.protocol.replace(':', '') +
      ';action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE' +
      ';S.browser_fallback_url=' + encodeURIComponent(url) + ';end';
  }
  function externalUrl(url) {
    if (isAndroid) return androidIntent(url);
    if (isIOS) return url.replace(/^https:\/\//, 'x-safari-https://').replace(/^http:\/\//, 'x-safari-http://');
    return url;
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
      document.body.appendChild(field);
      field.select();
      field.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      document.body.removeChild(field);
      ok ? resolve() : reject(new Error('copy'));
    });
  }

  /* ---------- Panel ---------- */
  var panel, titleEl, urlEl, statusEl, openBtn, stayLink, shareBtn, currentUrl = '';
  function buildPanel() {
    if (panel) return panel;
    var css = document.createElement('style');
    css.textContent =
      '#kva-social{border:1px solid #d9a441;border-radius:14px;padding:0;width:min(400px,calc(100% - 24px));background:#0b1735;color:#fff;font:15px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
      '#kva-social::backdrop{background:rgba(7,18,37,.55)}' +
      '#kva-social .ks-in{padding:18px 18px 14px}' +
      '#kva-social h2{margin:0 0 6px;font-size:17px;font-weight:700;color:#fff}' +
      '#kva-social p{margin:0 0 12px;color:#c9d3ea;font-size:14px}' +
      '#kva-social input{width:100%;box-sizing:border-box;margin:0 0 12px;padding:9px 10px;border:1px solid #33456f;border-radius:8px;background:#071225;color:#fff;font-size:14px}' +
      '#kva-social .ks-b{display:block;width:100%;box-sizing:border-box;margin:0 0 8px;padding:12px;border:0;border-radius:10px;background:#16264d;color:#fff;font:inherit;font-weight:600;text-align:center;text-decoration:none;cursor:pointer}' +
      '#kva-social .ks-b.ks-main{background:#d9a441;color:#0b1735}' +
      '#kva-social .ks-close{background:transparent;color:#c9d3ea;margin:4px 0 0}' +
      '#kva-social .ks-status{min-height:1.2em;margin:2px 0 8px;color:#d9a441;font-size:13px;text-align:center}' +
      '@media print{#kva-social{display:none!important}}';
    document.head.appendChild(css);
    panel = document.createElement('dialog');
    panel.id = 'kva-social';
    panel.setAttribute('aria-labelledby', 'kva-social-title');
    panel.innerHTML =
      '<div class="ks-in">' +
      '<h2 id="kva-social-title"></h2>' +
      '<p>Si el navegador de esta aplicación no lo abre bien, ábrelo en tu navegador o copia el enlace. ' +
      'También puedes tocar <strong>⋯</strong> (arriba) y elegir «Abrir en navegador externo».</p>' +
      '<input type="text" readonly aria-label="Enlace">' +
      '<a class="ks-b ks-main" data-ks="open" rel="noopener" autofocus>Abrir en navegador / app</a>' +
      '<button type="button" class="ks-b" data-ks="copy">Copiar enlace</button>' +
      '<button type="button" class="ks-b" data-ks="share">Compartir</button>' +
      '<a class="ks-b" data-ks="stay" rel="noopener">Continuar aquí</a>' +
      '<div class="ks-status" role="status" aria-live="polite"></div>' +
      '<button type="button" class="ks-b ks-close" data-ks="close">Cerrar</button>' +
      '</div>';
    document.body.appendChild(panel);
    titleEl = panel.querySelector('h2');
    urlEl = panel.querySelector('input');
    statusEl = panel.querySelector('.ks-status');
    openBtn = panel.querySelector('[data-ks="open"]');
    stayLink = panel.querySelector('[data-ks="stay"]');
    shareBtn = panel.querySelector('[data-ks="share"]');
    if (!navigator.share) shareBtn.hidden = true;
    urlEl.addEventListener('focus', function () { urlEl.select(); });
    panel.querySelector('[data-ks="copy"]').addEventListener('click', function () {
      copy(currentUrl).then(function () { statusEl.textContent = 'Enlace copiado. Pégalo en tu navegador o en la app.'; },
        function () { urlEl.focus(); urlEl.select(); statusEl.textContent = 'Mantén presionado el enlace de arriba para copiarlo.'; });
    });
    shareBtn.addEventListener('click', function () {
      navigator.share({ title: document.title, url: currentUrl }).catch(function () { /* cancelled */ });
    });
    panel.querySelector('[data-ks="close"]').addEventListener('click', function () { panel.close(); });
    panel.addEventListener('click', function (e) { if (e.target === panel) panel.close(); });
    return panel;
  }
  function showPanel(url, platform) {
    buildPanel();
    currentUrl = url;
    titleEl.textContent = platform === 'web' ? 'Abrir o compartir este enlace' : 'Abrir ' + NAMES[platform] + ' de KVARETIE';
    urlEl.value = url;
    statusEl.textContent = '';
    openBtn.href = externalUrl(url);
    stayLink.href = url;
    if (typeof panel.showModal === 'function') {
      if (!panel.open) panel.showModal();
    } else {
      panel.setAttribute('open', '');
    }
  }
  window.KvaSocial = { open: showPanel, copy: copy, inApp: host };

  /* ---------- Click handling (in-app browsers only) ---------- */
  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || (panel && panel.contains(link))) return;
    // Explicit share/copy buttons: <a|button data-kva-share="URL">
    var shareEl = event.target.closest('[data-kva-share]');
    if (shareEl) return;
    var url;
    try { url = new URL(link.href); } catch (_) { return; }
    var platform = platformOf(url);
    if (!platform || !host) return;           // normal browsers: native behaviour
    if (platform === host) return;             // e.g. Instagram link inside Instagram opens natively
    event.preventDefault();
    if (isAndroid) {
      // Try to hand the link to the app / default browser, then offer the panel if we are still here.
      var left = false;
      var onHide = function () { left = true; };
      document.addEventListener('visibilitychange', onHide, { once: true });
      window.addEventListener('pagehide', onHide, { once: true });
      location.href = androidIntent(url.href);
      setTimeout(function () {
        if (!left && document.visibilityState === 'visible') showPanel(url.href, platform);
      }, 1200);
    } else {
      showPanel(url.href, platform);
    }
  });

  // Generic share/copy trigger for any element marked data-kva-share (value = URL or empty for current page).
  document.addEventListener('click', function (event) {
    var el = event.target.closest && event.target.closest('[data-kva-share]');
    if (!el) return;
    event.preventDefault();
    var url = el.getAttribute('data-kva-share') || location.href.split('#')[0];
    if (navigator.share && !host) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
    } else {
      showPanel(url, 'web');
    }
  });
})();
