// Generates usable, contextual WhatsApp links even when JavaScript is disabled.
const fs = require('node:fs');
const path = require('node:path');
const config = require('../assets/js/contact.js');
const pages = {
  'index.html': 'web_general',
  'presentacion/index.html': 'presentacion',
  'aliados/index.html': 'red_aliados',
  'brochure/index.html': 'brochure',
  'fichas-informativas/index.html': 'fichas_informativas'
};
for (const [file, origin] of Object.entries(pages)) {
  const filename = path.join(__dirname, '..', file);
  const before = fs.readFileSync(filename, 'utf8');
  const after = before.replace(/<a\b[^>]*href="https:\/\/wa\.me\/[^\"]*"[^>]*>/g, tag => {
    const source = tag.match(/data-contact-origin="([^"]+)"/)?.[1] || origin;
    const service = tag.match(/data-contact-service="([^"]+)"/)?.[1];
    tag = tag.replace(/href="[^"]*"/, 'href="' + config.url(source, service) + '"');
    if (!tag.includes('data-contact-origin=')) tag = tag.replace('<a ', '<a data-contact-origin="' + source + '" ');
    return tag;
  });
  if (before !== after) fs.writeFileSync(filename, after);
}
