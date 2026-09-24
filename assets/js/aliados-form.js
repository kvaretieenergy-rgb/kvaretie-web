(function(){
  var form = document.getElementById('aliadosForm');
  var formCard = document.getElementById('formCard');
  var submitBtn = document.getElementById('submitBtn');
  var submitBtnText = document.getElementById('submitBtnText');
  var successBox = document.getElementById('successMessage');
  var formError = document.getElementById('formError');
  var isSubmitting = false;

  var ENDPOINT = 'https://formsubmit.co/ajax/kvaretie.energy@gmail.com';
  var HUBSPOT_ENDPOINT = 'https://api.hsforms.com/submissions/v3/integration/submit/51934019/5d5cd5d8-e399-413a-9bea-de7e3aea6b57';

  // Acknowledged by at least one channel; not confirmation of inbox delivery.
  if (window.KvaContact && window.KvaContact.wasSubmitted()) {
    formCard.style.display = 'none';
    successBox.classList.add('show');
  }

  function focusForm(){
    if (formCard.style.display !== 'none') {
      form.elements['nombre_completo'].focus({ preventScroll: true });
    }
  }

  function revealForm(){
    if (location.hash !== '#formulario') return;
    var chat = document.getElementById('kva-chat');
    if (chat && chat.open) {
      // navigation.js restores focus to the launcher when the dialog closes.
      chat.addEventListener('close', function(){
        window.setTimeout(focusForm, 0);
      }, { once: true });
      chat.close();
    } else {
      focusForm();
    }
  }

  window.addEventListener('pageshow', revealForm);
  window.addEventListener('hashchange', revealForm);
  window.addEventListener('popstate', revealForm);
  document.addEventListener('click', function(event){
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    var destination = new URL(link.href, location.href);
    if (destination.origin === location.origin && destination.pathname === location.pathname &&
        destination.search === location.search && destination.hash === '#formulario') {
      // Same-page navigation uses replaceState, which does not emit hashchange.
      window.setTimeout(revealForm, 0);
    }
  });

  function clearErrors(){
    var fields = form.querySelectorAll('.field.has-error');
    fields.forEach(function(f){ f.classList.remove('has-error'); });
  }

  function markError(name){
    var field = form.querySelector('.field[data-field="' + name + '"]');
    if (field) field.classList.add('has-error');
    return field;
  }

  function isValidEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function isValidPhone(v){
    var digits = v.replace(/[^0-9]/g, '');
    return digits.length >= 7;
  }

  function validate(){
    var errors = [];
    var val = function(name){
      var el = form.elements[name];
      return el ? el.value.trim() : '';
    };

    if (!val('nombre_completo')) errors.push('nombre_completo');
    if (!val('tipo_aliado')) errors.push('tipo_aliado');
    if (!val('especialidad')) errors.push('especialidad');
    if (!val('ciudad')) errors.push('ciudad');

    var wa = val('whatsapp');
    if (!wa || !isValidPhone(wa)) errors.push('whatsapp');

    var correo = val('correo');
    if (!correo || !isValidEmail(correo)) errors.push('correo');

    var colaboracion = form.querySelectorAll('input[name="colaboracion"]:checked');
    if (colaboracion.length === 0) errors.push('colaboracion');

    if (!form.elements['autorizacion'].checked) errors.push('autorizacion');

    return errors;
  }

  function buildPayload(){
    var val = function(name){
      var el = form.elements[name];
      return el ? el.value.trim() : '';
    };
    var colaboracion = Array.from(form.querySelectorAll('input[name="colaboracion"]:checked')).map(function(el){ return el.value; });
    var now = new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Bogota' });

    return {
      _subject: 'Nueva solicitud — Red de Aliados KVARETIE',
      _template: 'table',
      _captcha: 'false',
      _honey: form.elements['_honey'].value,
      _replyto: val('correo'),
      'ORIGEN': 'red_aliados',
      'INTERÉS': 'alianza',
      'ESTADO': 'solicitud_enviada',
      'RETORNO': window.KvaContact ? window.KvaContact.formReturn : location.href.split('#')[0] + '#formulario',
      'NOMBRE': val('nombre_completo'),
      'EMPRESA': val('empresa') || '—',
      'TIPO DE ALIADO': val('tipo_aliado'),
      'ESPECIALIDAD': val('especialidad'),
      'CIUDAD': val('ciudad'),
      'COBERTURA': val('cobertura') || '—',
      'WHATSAPP': val('whatsapp'),
      'CORREO': val('correo'),
      'WEB / RED SOCIAL / PORTAFOLIO': val('web_social') || '—',
      'TIPO DE COLABORACIÓN': colaboracion.length ? colaboracion.join(', ') : '—',
      'PRESENTACIÓN': val('presentacion') || '—',
      'MATRÍCULA / ACREDITACIÓN': val('matricula') || '—',
      'PORTAFOLIO': val('portafolio') || '—',
      'MENSAJE': val('mensaje_adicional') || '—',
      'AUTORIZACIÓN': form.elements['autorizacion'].checked ? 'Aceptada' : 'No aceptada',
      'FECHA': now
    };
  }

  function buildHubSpotPayload(payload){
    var fields = [
      { name: 'email', value: payload.CORREO },
      { name: 'firstname', value: payload.NOMBRE },
      { name: 'phone', value: payload.WHATSAPP },
      { name: 'city', value: payload.CIUDAD }
    ];
    var digits = payload.WHATSAPP.replace(/[^0-9]/g, '');
    if (digits.length === 10) digits = '57' + digits;
    if (/^57[0-9]{10}$/.test(digits)) {
      fields.push({ name: 'hs_whatsapp_phone_number', value: '+' + digits });
    }
    var website = form.elements['web_social'].value.trim();
    if (website) fields.push({ name: 'website', value: website });
    var message = ['[Red de Aliados]', 'Origen: red_aliados'];
    ['EMPRESA', 'TIPO DE ALIADO', 'ESPECIALIDAD', 'COBERTURA', 'TIPO DE COLABORACIÓN',
      'PRESENTACIÓN', 'MATRÍCULA / ACREDITACIÓN', 'PORTAFOLIO', 'MENSAJE'].forEach(function(name){
      message.push(name + ': ' + payload[name]);
    });
    fields.push({ name: 'message', value: message.join('\n') });
    var context = { pageUri: location.href, pageName: document.title };
    try {
      var cookie = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
      if (cookie) context.hutk = decodeURIComponent(cookie[1]);
    } catch (_) { /* Submission does not require cookies. */ }
    return {
      fields: fields,
      context: context,
      legalConsentOptions: {
        consent: {
          consentToProcess: form.elements['autorizacion'].checked,
          text: form.elements['autorizacion'].closest('label').querySelector('span').textContent.trim()
        }
      }
    };
  }

  function sendToChannel(endpoint, payload, isHubSpot){
    // Each channel settles independently, including network errors and timeouts.
    var controller = new AbortController();
    var timeout = window.setTimeout(function(){ controller.abort(); }, 15000);
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).then(function(resp){
      if (isHubSpot) return resp.ok;
      return resp.json().catch(function(){ return null; }).then(function(data){
        return resp.ok && data && String(data.success) === 'true';
      });
    }).catch(function(){
      return false;
    }).finally(function(){
      window.clearTimeout(timeout);
    });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (isSubmitting) return;

    clearErrors();
    formError.classList.remove('show');

    // Honeypot: if filled, silently drop (looks like a bot)
    if (form.elements['_honey'].value) return;

    var errors = validate();
    if (errors.length) {
      var firstField = null;
      errors.forEach(function(name){
        var f = markError(name);
        if (!firstField) firstField = f;
      });
      if (firstField) firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    var originalText = submitBtnText.textContent;
    submitBtnText.textContent = 'Enviando...';

    var payload = buildPayload();

    Promise.all([
      Promise.resolve().then(function(){
        return sendToChannel(HUBSPOT_ENDPOINT, buildHubSpotPayload(payload), true);
      }).catch(function(){ return false; }),
      sendToChannel(ENDPOINT, payload, false)
    ]).then(function(results){
      if (results.some(function(accepted){ return accepted; })) {
        if (window.KvaContact) {
          try { sessionStorage.setItem(window.KvaContact.submittedKey, 'true'); } catch (_) { /* Optional session persistence. */ }
          window.KvaContact.refresh();
        }
        formCard.style.display = 'none';
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        formError.classList.add('show');
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }).catch(function(){
      formError.classList.add('show');
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).finally(function(){
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtnText.textContent = originalText;
    });
  });
})();
