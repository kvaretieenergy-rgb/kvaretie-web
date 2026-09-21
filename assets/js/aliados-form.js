(function(){
  var form = document.getElementById('aliadosForm');
  var formCard = document.getElementById('formCard');
  var submitBtn = document.getElementById('submitBtn');
  var submitBtnText = document.getElementById('submitBtnText');
  var successBox = document.getElementById('successMessage');
  var formError = document.getElementById('formError');
  var isSubmitting = false;

  var ENDPOINT = 'https://formsubmit.co/ajax/kvaretie.energy@gmail.com';

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

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function(resp){
      return resp.json().catch(function(){ return null; }).then(function(data){
        return { ok: resp.ok, data: data };
      });
    }).then(function(result){
      if (result.ok && result.data && String(result.data.success) === 'true') {
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
