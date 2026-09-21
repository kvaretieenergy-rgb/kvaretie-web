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
