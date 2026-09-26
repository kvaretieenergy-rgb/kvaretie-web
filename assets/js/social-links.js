/* KVARETIE · Social links that keep working inside in-app browsers (v2, 2026-09-26).
 *
 * Normal browsers (Safari, Chrome, WhatsApp's browser…): links are left untouched, so the
 * operating system opens the TikTok / Instagram / Facebook app through its universal/app link.
 *
 * In-app browsers (Instagram, Facebook, Messenger, TikTok…), for a link to ANOTHER platform:
 *  - Android (any app): on the visitor's tap, an intent:// URL hands the link to Android, which
 *    opens the TikTok app (or the default browser if it is not installed).
 *  - iPhone inside Instagram: on the visitor's tap, Instagram's own "open in external browser"
 *    scheme (instagram://extbrowser/?url=) hands the link to iOS (TikTok app or Safari).
 *  - iPhone inside Facebook/Messenger/others: Meta offers no way for a web page to leave its
 *    browser (x-safari-https:// is blocked since 2025), so no fake "open" button is shown:
 *    the panel offers "Copiar enlace" plus the exact menu steps (⋯ → Abrir en navegador externo).
 * If the hand-off does not happen, a panel appears with the working alternatives.
 * A link to the same platform (Instagram link inside Instagram) is left to the app itself. */
(function () {
  'use strict';
  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var host = /Instagram/i.test(ua) ? 'instagram'
    : /FBAN|FBAV|FB_IAB|FB4A|FBIOS|MessengerForiOS|Messenger/i.test(ua) ? 'facebook'
    : /musical_ly|BytedanceWebview|TikTok|trill_/i.test(ua) ? 'tiktok'
    : /Threads|Barcelona|LinkedInApp|Snapchat|Line\/|Twitter/i.test(ua) ? 'other' : '';
  var NAMES = { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', web: 'este enlace' };
  var HOST_NAMES = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', other: 'esta aplicación' };

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
  /* Hand-off URL that can really leave this in-app browser, or '' when none exists. */
  function escapeUrl(url) {
    if (!host) return url;
    if (isAndroid) return androidIntent(url);
    if (isIOS && host === 'instagram') return 'instagram://extbrowser/?url=' + encodeURIComponent(url);
    return '';
  }
  function menuHint() {
    var app = HOST_NAMES[host] || 'esta aplicación';
    if (isAndroid) return 'También puedes tocar ⋮ (arriba a la derecha) y elegir «Abrir en Chrome» o «Abrir en navegador».';
    return 'También puedes tocar ⋯ (arriba a la derecha) en ' + app + ' y elegir «Abrir en navegador externo».';
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
  var panel, titleEl, textEl, urlEl, statusEl, openBtn, copyBtn, stayLink, shareBtn, currentUrl = '';
  function buildPanel() {
    if (panel) return panel;
    var css = document.createElement('style');
    css.textContent =
      '#kva-social{border:1px solid #d9a441;border-radius:14px;padding:0;width:min(400px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;background:#0b1735;color:#fff;font:15px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
      '#kva-social[data-fallback]{position:fixed;inset:12px;margin:auto;height:fit-content;z-index:2147483647;box-shadow:0 0 0 100vmax rgba(7,18,37,.55)}' +
      '#kva-social::backdrop{background:rgba(7,18,37,.55)}' +
      '#kva-social .ks-in{padding:18px 18px 14px}' +
      '#kva-social h2{margin:0 0 6px;font-size:17px;font-weight:700;color:#fff}' +
      '#kva-social p{margin:0 0 12px;color:#c9d3ea;font-size:14px}' +
      '#kva-social input{width:100%;box-sizing:border-box;margin:0 0 12px;padding:9px 10px;border:1px solid #33456f;border-radius:8px;background:#071225;color:#fff;font-size:16px}' +
      '#kva-social .ks-b{display:block;width:100%;box-sizing:border-box;margin:0 0 8px;padding:12px;border:0;border-radius:10px;background:#16264d;color:#fff;font:inherit;font-weight:600;text-align:center;text-decoration:none;cursor:pointer}' +
      '#kva-social .ks-b.ks-main{background:#d9a441;color:#0b1735}' +
      '#kva-social .ks-b[hidden]{display:none}' +
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
      '<p class="ks-text"></p>' +
      '<a class="ks-b ks-main" data-ks="open" rel="noopener"></a>' +
      '<button type="button" class="ks-b" data-ks="copy">Copiar enlace</button>' +
      '<input type="text" readonly aria-label="Enlace">' +
      '<button type="button" class="ks-b" data-ks="share">Compartir</button>' +
      '<a class="ks-b" data-ks="stay" rel="noopener">Continuar aquí</a>' +
      '<div class="ks-status" role="status" aria-live="polite"></div>' +
      '<button type="button" class="ks-b ks-close" data-ks="close">Cerrar</button>' +
      '</div>';
    document.body.appendChild(panel);
    titleEl = panel.querySelector('h2');
    textEl = panel.querySelector('.ks-text');
    urlEl = panel.querySelector('input');
    statusEl = panel.querySelector('.ks-status');
    openBtn = panel.querySelector('[data-ks="open"]');
    copyBtn = panel.querySelector('[data-ks="copy"]');
    stayLink = panel.querySelector('[data-ks="stay"]');
    shareBtn = panel.querySelector('[data-ks="share"]');
    if (!navigator.share) shareBtn.hidden = true;
    urlEl.addEventListener('focus', function () { urlEl.select(); });
    copyBtn.addEventListener('click', function () {
      copy(currentUrl).then(function () {
        statusEl.textContent = 'Enlace copiado. Pégalo en Safari, Chrome o en la app.';
      }, function () {
        urlEl.focus(); urlEl.select();
        statusEl.textContent = 'Mantén presionado el enlace de arriba y elige «Copiar».';
      });
    });
    shareBtn.addEventListener('click', function () {
      navigator.share({ title: document.title, url: currentUrl }).catch(function () { /* cancelled */ });
    });
    panel.querySelector('[data-ks="close"]').addEventListener('click', closePanel);
    panel.addEventListener('click', function (e) { if (e.target === panel) closePanel(); });
    return panel;
  }
  function closePanel() {
    if (typeof panel.close === 'function' && panel.open) panel.close();
    panel.removeAttribute('open');
    panel.removeAttribute('data-fallback');
  }
  function showPanel(url, platform) {
    buildPanel();
    currentUrl = url;
    var target = platform === 'web' ? 'este enlace' : NAMES[platform] + ' de KVARETIE';
    var exit = escapeUrl(url);
    titleEl.textContent = platform === 'web' ? 'Abrir o compartir este enlace' : 'Abrir ' + target;
    if (!host) {
      textEl.textContent = 'Copia el enlace o compártelo por WhatsApp, Instagram o Facebook.';
      openBtn.textContent = platform === 'web' ? 'Abrir enlace' : 'Abrir ' + NAMES[platform];
      openBtn.href = url;
      openBtn.target = '_blank';
      openBtn.hidden = false;
      copyBtn.classList.remove('ks-main');
    } else if (exit && exit !== url) {
      textEl.textContent = HOST_NAMES[host] + ' abre los enlaces en su propio navegador, donde ' +
        (platform === 'web' ? 'algunas páginas' : NAMES[platform]) + ' no funciona bien. Toca el botón para abrirlo en la app o en tu navegador. ' + menuHint();
      openBtn.textContent = platform === 'tiktok' ? 'Abrir TikTok' : 'Abrir ' + (NAMES[platform] || 'en navegador');
      openBtn.href = exit;
      openBtn.hidden = false;
      copyBtn.classList.remove('ks-main');
    } else {
      textEl.textContent = (HOST_NAMES[host] || 'Esta aplicación') + ' no permite que una página web abra ' +
        (platform === 'web' ? 'otro navegador' : 'la app de ' + NAMES[platform]) + '. Copia el enlace y pégalo en Safari o Chrome. ' + menuHint();
      openBtn.hidden = true;
      openBtn.removeAttribute('href');
      copyBtn.classList.add('ks-main');
    }
    urlEl.value = url;
    statusEl.textContent = '';
    stayLink.href = url;
    if (typeof panel.showModal === 'function') {
      if (!panel.open) panel.showModal();
    } else {
      panel.setAttribute('data-fallback', '');
      panel.setAttribute('open', '');
    }
    (openBtn.hidden ? copyBtn : openBtn).focus({ preventScroll: true });
  }
  window.KvaSocial = { open: showPanel, copy: copy, inApp: host, escapeUrl: escapeUrl };

  /* Try the hand-off on the visitor's own tap; show the panel only if we are still here. */
  function handOff(url, platform) {
    var exit = escapeUrl(url);
    if (!exit || exit === url) { showPanel(url, platform); return; }
    var left = false;
    var onHide = function () { if (document.visibilityState === 'hidden') left = true; };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', function () { left = true; }, { once: true });
    location.href = exit;
    setTimeout(function () {
      document.removeEventListener('visibilitychange', onHide);
      if (!left && document.visibilityState === 'visible') showPanel(url, platform);
    }, 1500);
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (!event.target.closest) return;
    if (event.target.closest('[data-kva-share]')) return;
    var link = event.target.closest('a[href]');
    if (!link || (panel && panel.contains(link))) return;
    var url;
    try { url = new URL(link.href); } catch (_) { return; }
    var platform = platformOf(url);
    if (!platform || !host) return;           // normal browsers: native behaviour (opens the app)
    if (platform === host) return;             // e.g. Instagram link inside Instagram opens natively
    event.preventDefault();
    handOff(url.href, platform);
  });

  // Share/copy trigger for any element marked data-kva-share (value = URL, or empty for this page).
  document.addEventListener('click', function (event) {
    var el = event.target.closest && event.target.closest('[data-kva-share]');
    if (!el) return;
    event.preventDefault();
    var url = el.getAttribute('data-kva-share') || location.href.split('#')[0];
    if (navigator.share && !host) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
    } else {
      showPanel(url, platformOf(new URL(url, location.href)) || 'web');
    }
  });
})();
