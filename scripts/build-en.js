/* ============================================================
   Genera en/index.html a partir de index.html y assets/i18n.js.

   La versión en inglés tiene que existir como HTML propio para que
   Google la indexe (con su title, description y hreflang). En vez de
   mantener dos copias a mano, se regenera con:

       node scripts/build-en.js

   Hay que ejecutarlo después de cambiar index.html o los textos de
   assets/i18n.js, y subir el en/index.html resultante.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://www.tallerdechapaypintura.com';

const src = fs.readFileSync(path.join(ROOT, 'assets/i18n.js'), 'utf8');
const I18N = JSON.parse(src.split('const I18N = ')[1].trim().replace(/;$/, ''));
const EN = I18N.en;

const META = {
  title: 'Body shop management software · Taller de Chapa y Pintura',
  description: 'Run your body shop from one screen: digital check-in with e-signature, damage mapping, photos, live repair tracking and courtesy cars. Flat fee per shop.',
  ogTitle: 'Taller de Chapa y Pintura · From claim to handover, the whole shop on one screen',
  ogDescription: 'Digital check-in with e-signature, damage on the vehicle diagram, live tracking and a customer portal. Flat fee per shop, no per-user cost.',
  ldDescription: 'End-to-end management software for body shops: digital check-in with e-signature, damage assessment, live tracking, courtesy vehicles and handover.',
  ldOffer: 'Monthly subscription per shop, unlimited users',
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const missing = new Set();

/* Textos: cada elemento con data-i18n contiene solo texto. */
html = html.replace(/(data-i18n="([^"]+)"[^>]*>)([^<]*)</g, (m, open, key, text) => {
  if (!text.trim()) return m;
  if (EN[key] === undefined) { missing.add(key); return m; }
  return open + esc(EN[key]) + '<';
});

/* Placeholders. */
html = html.replace(/<[^>]*data-i18n-ph="([^"]+)"[^>]*>/g, (tag, key) => {
  if (EN[key] === undefined) { missing.add(key); return tag; }
  return tag.replace(/placeholder="[^"]*"/, 'placeholder="' + escAttr(EN[key]) + '"');
});

const swap = (from, to) => {
  if (!html.includes(from)) throw new Error('No encuentro en index.html: ' + from);
  html = html.split(from).join(to);
};

swap('<html lang="es">', '<html lang="en">');
html = html.replace(/<title>[^<]*<\/title>/, '<title>' + esc(META.title) + '</title>');
html = html.replace(/(<meta name="description" content=")[^"]*"/, '$1' + escAttr(META.description) + '"');
html = html.replace(/(<meta property="og:title" content=")[^"]*"/, '$1' + escAttr(META.ogTitle) + '"');
html = html.replace(/(<meta property="og:description" content=")[^"]*"/, '$1' + escAttr(META.ogDescription) + '"');
swap('<link rel="canonical" href="' + SITE + '/">', '<link rel="canonical" href="' + SITE + '/en/">');
swap('<meta property="og:url" content="' + SITE + '/">', '<meta property="og:url" content="' + SITE + '/en/">');
swap('<meta property="og:locale" content="es_ES">\n<meta property="og:locale:alternate" content="en_GB">',
     '<meta property="og:locale" content="en_GB">\n<meta property="og:locale:alternate" content="es_ES">');
html = html.replace(/("description":")[^"]*(")/, '$1' + META.ldDescription + '$2');
html = html.replace(/("@type":"Offer"[^}]*"description":")[^"]*"/, '$1' + META.ldOffer + '"');
swap('"operatingSystem":"Web",', '"operatingSystem":"Web",\n  "inLanguage":"en",');

/* Rutas: la página vive un nivel más abajo. */
html = html.replace(/(href|src)="assets\//g, '$1="../assets/');

/* Idioma fijo y equivalencias con la versión española. */
swap('<body data-lang-lock="es" data-lang-alt="en/" data-thanks="gracias/">',
     '<body data-lang-lock="en" data-lang-alt="../" data-thanks="../thank-you/">');

html = html.replace('<!DOCTYPE html>\n',
  '<!DOCTYPE html>\n<!-- Archivo generado por scripts/build-en.js a partir de index.html. No editar a mano. -->\n');

if (missing.size) {
  console.error('Faltan traducciones en inglés para: ' + [...missing].join(', '));
  process.exit(1);
}

fs.mkdirSync(path.join(ROOT, 'en'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'en/index.html'), html);
console.log('en/index.html generado.');
