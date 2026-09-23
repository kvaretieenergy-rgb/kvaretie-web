/* Internal return navigation: native history restores each entry's scroll. */
(function () {
  'use strict';
  var root = new URL('../../', document.currentScript.src);
  var key = 'kvaretie-navigation:' + root.pathname;
  function internal(url) {
    return url.origin === root.origin && url.pathname.startsWith(root.pathname);
  }
  function page(url) { return url.origin + url.pathname + url.search; }
  if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
  window.addEventListener('pagehide', function () {
    history.replaceState(Object.assign({}, history.state, { kvaScroll: [scrollX, scrollY] }), '');
  });
  window.addEventListener('pageshow', function (event) {
    var navigation = performance.getEntriesByType('navigation')[0];
    var position = history.state && history.state.kvaScroll;
    if (position && (event.persisted || (navigation && navigation.type === 'back_forward'))) {
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        window.scrollTo({ left: position[0], top: position[1], behavior: 'instant' });
      }); });
    }
  });

  // A one-use marker distinguishes real same-tab navigation from a direct visit.
  // The resulting origin belongs to this history entry, including after a reload.
  try {
    var pending = JSON.parse(sessionStorage.getItem(key) || 'null');
    sessionStorage.removeItem(key);
    if (pending && pending.to === page(location) && Date.now() - pending.time < 30000 &&
        document.referrer && page(new URL(document.referrer)) === page(new URL(pending.from)) &&
        internal(new URL(pending.from))) {
      history.replaceState(Object.assign({}, history.state, { kvaOrigin: pending.from }), '');
    }
  } catch (_) { /* Native links remain usable when storage is unavailable. */ }

  document.querySelectorAll('[data-kva-back]').forEach(function (link) {
    var from = history.state && history.state.kvaOrigin;
    link.href = from && internal(new URL(from)) ? from : root.href;
  });
  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    if (link.hasAttribute('data-kva-back')) {
      var from = history.state && history.state.kvaOrigin;
      if (from && internal(new URL(from)) && history.length > 1) {
        event.preventDefault();
        history.back();
      }
      return;
    }
    var destination = new URL(link.href);
    // Section anchors must not insert an extra entry between this page and its origin.
    if (internal(destination) && page(destination) === page(location) && destination.hash) {
      var section = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
      if (!section) return;
      event.preventDefault();
      history.replaceState(history.state, '', destination.href);
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (internal(destination) && page(destination) !== page(location)) {
      try {
        sessionStorage.setItem(key, JSON.stringify({ from: location.href, to: page(destination), time: Date.now() }));
      } catch (_) { /* No storage requirement for ordinary navigation. */ }
    }
  });
})();

/* One contact launcher: HubSpot when available, contextual WhatsApp as fallback. */
(function () {
  'use strict';
  if (/\/brochure\//.test(location.pathname)) return;
  var launcher = document.querySelector('.wa-float');
  if (!launcher || document.getElementById('hs-script-loader')) return;
  var originalIcon = launcher.innerHTML, ready = false;
  var dialog = document.createElement('dialog');
  dialog.id = 'kva-chat';
  dialog.setAttribute('aria-label', 'Chat de KVARETIE');
  dialog.innerHTML = '<button type="button" id="kva-chat-close">Cerrar chat ×</button><div id="kva-chat-host"></div>';
  document.body.appendChild(dialog);
  var css = document.createElement('style');
  css.textContent = '#kva-chat{padding:0;border:1px solid #d9a441;border-radius:12px;width:min(420px,calc(100% - 4px));max-width:calc(100% - 4px);max-height:calc(100dvh - 20px);overflow:hidden;margin:auto;background:#fff}' +
    '#kva-chat::backdrop{background:rgba(7,18,37,.4)}' +
    '#kva-chat-close{display:block;width:100%;border:0;padding:12px 16px;background:#0b1735;color:#fff;text-align:right;font:inherit;cursor:pointer}' +
    '#kva-chat-host{height:min(560px,calc(100dvh - 76px));width:100%}' +
    '#hubspot-conversations-inline-parent,#hubspot-conversations-inline-iframe{width:100%!important;height:100%!important;min-width:0!important;border:0}' +
    'body.kva-chat-open .wa-float{display:none!important}' +
    '.wa-float[data-contact-channel="hubspot"]{background:var(--navy-900,#0b1735)}';
  document.head.appendChild(css);
  window.hsConversationsSettings = Object.assign({}, window.hsConversationsSettings, { loadImmediately: true, inlineEmbedSelector: '#kva-chat-host' });
  function label(text) { launcher.setAttribute('aria-label', text); launcher.title = text; }
  function fallback() {
    ready = false;
    if (dialog.open) dialog.close();
    launcher.innerHTML = originalIcon;
    launcher.removeAttribute('data-contact-channel');
    label('Escribir por WhatsApp');
  }
  dialog.querySelector('button').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () {
    document.body.classList.remove('kva-chat-open');
    launcher.focus({ preventScroll: true });
  });
  launcher.addEventListener('click', function (event) {
    if (!ready || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (!document.getElementById('hubspot-conversations-inline-iframe')) { fallback(); return; }
    try {
      dialog.showModal();
      document.body.classList.add('kva-chat-open');
      event.preventDefault();
    } catch (_) { fallback(); } // Keep the ordinary WhatsApp destination usable.
  });
  function onReady() {
    window.HubSpotConversations.on('widgetLoaded', function () {
      ready = true;
      launcher.dataset.contactChannel = 'hubspot';
      launcher.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11a9 9 0 0 1-13 8l-5 2 1-5A9 9 0 1 1 21 11Z M8 10h8 M8 14h5"/></svg>';
      label('Abrir chat de KVARETIE');
    });
  }
  window.hsConversationsOnReady = (window.hsConversationsOnReady || []).concat(onReady);
  var script = document.createElement('script');
  script.id = 'hs-script-loader';
  script.async = true;
  script.defer = true;
  script.src = 'https://js-na1.hs-scripts.com/51934019.js';
  script.addEventListener('error', fallback);
  document.body.appendChild(script);
})();
