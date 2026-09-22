const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const config = require('../assets/js/contact.js');
const pages = ['index.html', 'presentacion/index.html', 'aliados/index.html', 'brochure/index.html', 'fichas-informativas/index.html'];
let count = 0;
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  assert.equal((html.match(/class="wa-float"/g) || []).length, 1, file);
  assert.equal((html.match(/assets\/js\/contact.js/g) || []).length, 1, file);
  for (const [tag] of html.matchAll(/<a\b[^>]*href="https:\/\/wa.me\/[^\"]*"[^>]*>/g)) {
    const origin = tag.match(/data-contact-origin="([^"]+)"/)[1];
    assert.equal(tag.match(/href="([^"]+)"/)[1], config.url(origin));
    if (file.startsWith('aliados/')) assert.equal(origin, 'red_aliados');
    count++;
  }
}
assert.match(decodeURIComponent(config.url('red_aliados', '', true)), /ya envié mi solicitud/);
assert.doesNotMatch(decodeURIComponent(config.url('red_aliados', '', true)), /antes de enviar/);
assert.match(decodeURIComponent(config.url('servicio_especifico', 'Energía solar')), /Energía solar/);
assert.equal(config.url('servicio_especifico'), config.url('contacto_general'));
assert.equal(config.url('unknown'), config.url('contacto_general'));

// Exercise submission failures/success without sending email or CRM requests.
async function formCase(response, reject, submitted = false) {
  const classes = () => ({ values: new Set(), add(v) { this.values.add(v); }, remove(v) { this.values.delete(v); } });
  const node = () => ({ classList: classes(), style: {}, scrollIntoView() {}, textContent: 'Enviar', disabled: false });
  const nodes = Object.fromEntries(['aliadosForm', 'formCard', 'submitBtn', 'submitBtnText', 'successMessage', 'formError'].map(id => [id, node()]));
  const form = nodes.aliadosForm;
  form.elements = Object.fromEntries(['nombre_completo', 'tipo_aliado', 'especialidad', 'ciudad', 'whatsapp', 'correo', '_honey', 'autorizacion'].map(k => [k, { value: k === '_honey' ? '' : k === 'correo' ? 'test@example.com' : k === 'whatsapp' ? '0000000' : 'TEST', checked: true }]));
  form.querySelectorAll = selector => selector.includes(':checked') ? [{ value: 'Otro' }] : [];
  form.addEventListener = (_, fn) => { form.submit = fn; };
  let payload, acknowledged = false;
  const context = {
    document: { getElementById: id => nodes[id] },
    window: { KvaContact: { ...config, wasSubmitted: () => submitted, refresh() {} } },
    sessionStorage: { setItem() { acknowledged = true; } },
    fetch: async (_, options) => { payload = JSON.parse(options.body); if (reject) throw Error('offline'); return response; },
    location: { href: config.formReturn }
  };
  vm.runInNewContext(fs.readFileSync('assets/js/aliados-form.js', 'utf8'), context);
  if (submitted) { assert.equal(nodes.formCard.style.display, 'none'); return; }
  form.submit({ preventDefault() {} });
  await new Promise(resolve => setImmediate(resolve));
  const success = !reject && response.ok && String((await response.json())?.success) === 'true';
  assert.equal(nodes.successMessage.classList.values.has('show'), success);
  assert.equal(nodes.formError.classList.values.has('show'), !success);
  assert.equal(acknowledged, success);
  assert.equal(nodes.submitBtn.disabled, false);
  assert.equal(payload.ORIGEN, 'red_aliados');
  assert.equal(payload.RETORNO, config.formReturn);
}
(async () => {
  for (const [ok, success] of [[true, true], [true, false], [false, true]]) await formCase({ ok, json: async () => ({ success }) });
  await formCase(null, true);
  await formCase(null, false, true);
  console.log(`${count} contextual links; service context; submitted state; success, rejection, HTTP and network failures: PASS`);
})();
