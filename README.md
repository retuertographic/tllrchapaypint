# Taller de Chapa y Pintura · Web de marketing

Sitio estático de una sola página para **Taller de Chapa y Pintura**, el software de gestión
integral para talleres de chapa y pintura (recepción con firma digital, peritaje
de daños sobre esquema visual, seguimiento en tiempo real, vehículos de cortesía
y entrega).

Construido siguiendo la misma arquitectura que
[`retuertographicdesign/capri`](https://github.com/retuertographicdesign/capri):
HTML estático + CSS propio + JS sin dependencias, bilingüe ES/EN, formulario
sin dependencias externas y despliegue en GitHub Pages.

## Estructura

```
index.html            Página completa en español (hero, producto, cómo funciona, precios, FAQ, contacto)
en/index.html         La misma página en inglés — GENERADA, no editar a mano (ver abajo)
gracias/, thank-you/  Páginas de agradecimiento tras enviar el formulario (noindex)
404.html              Página de error para cualquier URL que no exista
robots.txt            Permite todo y declara el sitemap
sitemap.xml           Las dos portadas, con sus equivalencias hreflang
assets/site.css       Sistema visual completo
assets/config.js      ← ÚNICO archivo con los datos reales que hay que rellenar
assets/i18n.js        Todos los textos en español e inglés
assets/layout.js      Parciales comunes: cabecera, pie, modal legal y botón "arriba"
assets/site-common.js Menú, idioma, FAQ, modal legal y formulario
scripts/build-en.js   Genera en/index.html a partir de index.html + i18n.js
```

## Versión en inglés

Cada idioma tiene su propia URL (`/` y `/en/`) para que Google indexe los
dos, enlazadas entre sí con `hreflang`. El selector de idioma lleva de una a
otra. `en/index.html` no se edita a mano: después de cambiar `index.html` o
los textos de `assets/i18n.js`, se regenera y se sube junto con el resto:

```bash
node scripts/build-en.js
```

El script falla si a alguna clave le falta la traducción al inglés. Los
title, description y Open Graph en inglés están al principio del script.

Tras enviar el formulario, la web lleva a `/gracias/` o `/thank-you/` según
el idioma (atributo `data-thanks` del `<body>`). Esas URL son las que hay que
medir como conversión.

## Pendiente de rellenar

Todo lo marcado como `[PENDIENTE]` en `assets/config.js`:

| Dato | Dónde |
|---|---|
| Teléfono y WhatsApp | `assets/config.js` |
| Buzón de protección de datos, si no es el mismo `info@` | `assets/config.js` |
| Dirección o ciudad | `assets/config.js` |
| Mecanismo de envío del formulario (`form.mode` y `form.endpoint`) | `assets/config.js` |
| Titular, NIF y domicilio fiscal | `assets/i18n.js`, claves `aviso_p1`, `priv_p1` (marcadores `[TITULAR]`, `[NIF]`, `[DIRECCIÓN FISCAL]`) |
| Email de privacidad en los textos legales | `assets/i18n.js`, marcador `[EMAIL PROTECCIÓN DE DATOS]` |
| Perfiles de LinkedIn / Instagram | `assets/config.js` (vacío = el icono no se muestra) |

### Envío del formulario

No usa ningún servicio de terceros por defecto. El mecanismo se elige en
`assets/config.js`, en el bloque `form`:

- `mode: 'endpoint'` — hace un `POST` a `form.endpoint`. Sirve para Formspree,
  Web3Forms, Netlify Forms, un Apps Script de Google o un backend propio. Con
  `payload: 'form'` envía `FormData` (lo que piden Formspree y Netlify) y con
  `payload: 'json'` envía JSON.
- `mode: 'mailto'` — abre el cliente de correo del visitante con el mensaje ya
  redactado. No necesita servidor.
- `mode: ''` (estado actual) — el formulario valida los campos pero no envía:
  muestra el aviso con las vías alternativas (teléfono, WhatsApp, email).

## Contenido y decisiones

- Los textos salen del plan de producto del proyecto: propuesta de valor, ciclo
  de las seis etapas, módulos y posicionamiento de precio.
- **Precios**: 99 € / 179 € / a medida, cuota plana por taller y usuarios
  ilimitados, siguiendo la franja de 99–179 €/mes del posicionamiento. Conviene
  confirmarlos antes de publicar.
- **No hay testimonios**: no se incluyen citas de clientes inventadas. Cuando
  haya testimonios reales, encajan entre la sección oscura y los precios.
- **No hay fotografías**: el mockup del hero es HTML/CSS. Si se añaden fotos
  reales del producto o de talleres, sustituyen a ese bloque.

## Desarrollo

Es HTML estático. Sírvelo con un servidor local (abriendo el archivo directamente
funcionan las páginas, pero no los enlaces entre idiomas ni la 404):

```bash
python3 -m http.server 4173
```

## Despliegue

GitHub Pages desde la rama `main`, carpeta raíz. El dominio es
**www.tallerdechapaypintura.com**, declarado en el archivo `CNAME`.

DNS necesarios en el registrador del dominio:

| Tipo | Nombre | Valor |
|---|---|---|
| CNAME | `www` | `retuertographicdesign.github.io.` |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Los registros `A` del dominio raíz hacen que `tallerdechapaypintura.com` redirija
a la versión con `www`. En GitHub: Settings › Pages › Custom domain con el
dominio, y marcar «Enforce HTTPS» cuando el certificado esté emitido.
