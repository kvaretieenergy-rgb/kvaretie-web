/* Contact configuration. After changing messages, run node scripts/sync-contact.cjs. */
(function (root) {
  'use strict';
  var config = {
    phone: '573016168670',
    formReturn: 'https://kvaretieenergy-rgb.github.io/kvaretie-web/aliados/#formulario',
    submittedKey: 'kvaretie:alliance-submitted',
    messages: {
      web_general: 'Hola, estoy visitando la página de KVARETIE y tengo una consulta sobre sus servicios.',
      presentacion: 'Hola, vi la presentación digital de KVARETIE y quisiera consultar sobre un proyecto.',
      red_aliados: 'Hola, estoy revisando la Red de Aliados de KVARETIE y tengo una duda antes de enviar mi solicitud.',
      brochure: 'Hola, estoy revisando el brochure de KVARETIE y necesito orientación.',
      fichas_informativas: 'Hola, estoy consultando las fichas informativas de KVARETIE y tengo una pregunta sobre sus soluciones.',
      servicio_especifico: 'Hola, estoy consultando el servicio de {servicio} de KVARETIE y necesito asesoría.',
      contacto_general: 'Hola, quisiera comunicarme con un asesor de KVARETIE.'
    },
    submittedMessage: 'Hola, ya envié mi solicitud a la Red de Aliados de KVARETIE y tengo una consulta sobre ella.'
  };
  config.url = function (origin, service, submitted) {
    if (!config.messages[origin]) origin = 'contacto_general';
    if (origin === 'servicio_especifico' && !service) origin = 'contacto_general';
    var message = origin === 'red_aliados' && submitted ? config.submittedMessage : config.messages[origin];
    return 'https://wa.me/' + config.phone + '?text=' + encodeURIComponent(message.replace('{servicio}', service || ''));
  };
  if (typeof module === 'object' && module.exports) { module.exports = config; return; }
  root.KvaContact = config;
  config.wasSubmitted = function () {
    try { return sessionStorage.getItem(config.submittedKey) === 'true'; } catch (_) { return false; }
  };
  config.refresh = function () {
    document.querySelectorAll('a[data-contact-origin]').forEach(function (link) {
      link.href = config.url(link.dataset.contactOrigin, link.dataset.contactService, config.wasSubmitted());
    });
  };
  config.refresh();
  window.addEventListener('pageshow', config.refresh);
  var style = document.createElement('style');
  style.textContent = 'body.kva-inline-contact .wa-float{visibility:hidden;pointer-events:none}';
  document.head.appendChild(style);
  if ('IntersectionObserver' in window) {
    var visibleContacts = new Set();
    var contactObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visibleContacts.add(entry.target);
        else visibleContacts.delete(entry.target);
      });
      document.body.classList.toggle('kva-inline-contact', visibleContacts.size > 0);
    });
    document.querySelectorAll('#contacto a[data-contact-origin], .contact-card[data-contact-origin]').forEach(function (link) {
      contactObserver.observe(link);
    });
  }
  var form = document.getElementById('formulario');
  if (form && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle('kva-form-visible', entries[0].isIntersecting);
    }).observe(form);
  }
  // Keep the keyboard and form fields free of the floating contact button.
  document.addEventListener('focusin', function (event) {
    document.body.classList.toggle('kva-form-focus', !!event.target.closest('#aliadosForm'));
  });
  document.addEventListener('focusout', function () {
    document.body.classList.remove('kva-form-focus');
  });
})(typeof window === 'undefined' ? globalThis : window);
