const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function element(attributes = {}) {
  return {
    attributes, handlers: {}, hidden: false,
    getAttribute(key) { return this.attributes[key] ?? null; },
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(name, callback) { this.handlers[name] = callback; }
  };
}
function gallery(categories, prefix) {
  const items = categories.map((cat, index) => element({
    'data-cat': cat, 'data-full': `${prefix}-${index}.webp`, 'data-label': `${prefix} ${index}`
  }));
  const buttons = ['todos', ...new Set(categories)].map(cat => element({
    'data-gfilter': cat, 'aria-pressed': cat === 'todos' ? 'true' : 'false'
  }));
  const root = { querySelectorAll: selector => selector === '[data-gitem]' ? items : buttons };
  items.forEach(item => { item.closest = () => root; });
  return { root, items, buttons, filter: cat => buttons.find(b => b.getAttribute('data-gfilter') === cat).handlers.click() };
}
const general = gallery(['redes', 'solar'], 'general');
const allies = gallery(['tableros', 'redes'], 'aliados');
const image = element(), caption = element();
const controls = { '.lb-close': element(), '.lb-prev': element(), '.lb-next': element() };
const lightbox = element();
lightbox.querySelector = selector => selector === 'img' ? image : selector === 'figcaption' ? caption : controls[selector];
const document = {
  body: { style: { overflow: '' } }, handlers: {},
  querySelector: () => lightbox,
  querySelectorAll: selector => selector === '[data-gallery]' ? [general.root, allies.root] : [...general.items, ...allies.items],
  addEventListener(name, callback) { this.handlers[name] = callback; }
};
const source = fs.readFileSync('assets/js/main.js', 'utf8')
  .split('/* ---------- Galería: filtros ---------- */')[1]
  .split('/* ---------- Visor de proceso')[0];
vm.runInNewContext(source, { document });

general.filter('redes');
assert.deepEqual(general.items.map(i => i.hidden), [false, true]);
assert.deepEqual(allies.items.map(i => i.hidden), [false, false]);
allies.filter('tableros');
assert.deepEqual(allies.items.map(i => i.hidden), [false, true]);
assert.deepEqual(general.items.map(i => i.hidden), [false, true]);
assert.equal(general.buttons[1].getAttribute('aria-pressed'), 'true');

allies.items[0].handlers.click();
controls['.lb-next'].handlers.click();
assert.equal(image.getAttribute('src'), 'aliados-0.webp', 'The filtered viewer must stay in its own gallery.');
controls['.lb-close'].handlers.click();
assert.equal(document.body.style.overflow, '');
assert.equal(lightbox.getAttribute('data-open'), 'false');

allies.filter('todos');
allies.items[0].handlers.keydown({ key: 'Enter', preventDefault() {} });
document.handlers.keydown({ key: 'ArrowRight' });
assert.equal(image.getAttribute('src'), 'aliados-1.webp');
document.handlers.keydown({ key: 'ArrowRight' });
assert.equal(image.getAttribute('src'), 'aliados-0.webp', 'Wrap-around must not show general-gallery photographs.');
document.handlers.keydown({ key: 'Escape' });
assert.equal(lightbox.getAttribute('data-open'), 'false');
assert.equal(image.getAttribute('src'), '');
console.log('PASS: independent filters, scoped viewer, wrap-around, keyboard and close.');
