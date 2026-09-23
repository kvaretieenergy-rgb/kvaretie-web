const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('assets/js/navigation.js', 'utf8').split('/* One contact launcher:')[1];
function setup(pathname = '/') {
  const classes = new Set(), events = {}, handlers = {}, attributes = {}, scripts = [];
  let frame = false, failOpen = false;
  const launcher = {
    innerHTML: 'whatsapp-icon', dataset: {},
    setAttribute(k, v) { attributes[k] = v; },
    removeAttribute(k) { delete attributes[k]; if (k === 'data-contact-channel') delete this.dataset.contactChannel; },
    addEventListener(k, fn) { handlers[k] = fn; }, focus() {}
  };
  const dialog = {
    open: false, handlers: {}, setAttribute() {}, querySelector() { return { addEventListener() {} }; },
    addEventListener(k, fn) { this.handlers[k] = fn; },
    showModal() { if (failOpen) throw Error('unavailable'); this.open = true; },
    close() { this.open = false; this.handlers.close(); }
  };
  const document = {
    querySelector: () => launcher,
    getElementById: id => id === 'hubspot-conversations-inline-iframe' && frame ? {} : null,
    createElement: tag => tag === 'dialog' ? dialog : { addEventListener(k, fn) { this[k] = fn; } },
    head: { appendChild() {} },
    body: { classList: { add: k => classes.add(k), remove: k => classes.delete(k) }, appendChild: s => { if (s.src) scripts.push(s); } }
  };
  const window = { HubSpotConversations: { on: (name, fn) => { events[name] = fn; } } };
  vm.runInNewContext('/* One contact launcher:' + source, { document, window, location: { pathname } });
  return {
    classes, launcher, attributes, scripts, dialog,
    ready() { window.hsConversationsOnReady[0](); },
    loaded() { frame = true; events.widgetLoaded(); },
    click() { let prevented = false; handlers.click({ preventDefault() { prevented = true; } }); return prevented; },
    removeFrame() { frame = false; }, fail() { failOpen = true; }
  };
}
const brochure = setup('/brochure/'); assert.equal(brochure.scripts.length, 0);
const chat = setup(); chat.ready();
assert.equal(chat.click(), false); // No loaded widget: ordinary WhatsApp link.
chat.loaded(); assert.equal(chat.launcher.dataset.contactChannel, 'hubspot');
assert.equal(chat.dialog.open, false); // No automatic welcome window.
assert(chat.click()); assert(chat.dialog.open); assert(chat.classes.has('kva-chat-open'));
assert.equal(chat.scripts.length, 1);
chat.dialog.close(); assert(!chat.classes.has('kva-chat-open'));
assert(chat.click()); chat.dialog.close();
chat.removeFrame(); assert.equal(chat.click(), false);
assert.equal(chat.launcher.innerHTML, 'whatsapp-icon');
const failed = setup(); failed.ready(); failed.loaded(); failed.fail();
assert.equal(failed.click(), false); assert.equal(failed.attributes['aria-label'], 'Escribir por WhatsApp');
const scriptError = setup(); scriptError.scripts[0].error();
assert.equal(scriptError.attributes['aria-label'], 'Escribir por WhatsApp');
console.log('PASS: brochure exclusion, no auto-open, single widget, close/reopen, missing iframe, dialog and script failure fallback.');
