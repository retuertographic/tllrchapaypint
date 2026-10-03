/* ============================================================
   ELEMENTOS COMUNES DE LA WEB
   Cabecera con navegación, pie, modal legal y botón "arriba".
   Se definen aquí una sola vez y se inyectan en cada página.

   Para usarlos en una página nueva basta con:
     <div data-layout="header"></div>
     ... contenido propio de la página ...
     <div data-layout="footer"></div>
     <div data-layout="legal"></div>
     <div data-layout="totop"></div>
   y cargar los scripts en este orden:
     config.js · i18n.js · layout.js · site-common.js

   Los marcadores que falten simplemente no se pintan, así que una
   página puede prescindir de cualquiera de ellos.
   ============================================================ */
(function () {
  'use strict';

  var LAYOUT = {
    header: `<header id="site-header">
  <a class="skip-link" href="#main" data-i18n="skip">Saltar al contenido</a>
  <div class="wrap">
    <nav aria-label="Navegación principal" data-i18n-aria="aria_nav">
      <a class="brand" href="#top">
        <span class="mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </span>
        <span class="brand-text">Taller de Chapa y Pintura<small>Software de gestión</small></span>
      </a>

      <ul class="nav-links" id="navLinks">
        <li><a href="#producto" data-i18n="nav_producto">Producto</a></li>
        <li><a href="#como-funciona" data-i18n="nav_como">Cómo funciona</a></li>
        <li><a href="#precios" data-i18n="nav_precios">Precios</a></li>
        <li><a href="#faq" data-i18n="nav_faq">FAQ</a></li>
        <li><a href="#contacto" data-i18n="nav_contacto">Contacto</a></li>
        <li><a href="#contacto" class="btn" data-i18n="nav_demo">Solicitar demo</a></li>
      </ul>

      <div class="lang-switch" id="langSwitch">
        <button type="button" class="lang-btn" id="langBtn" aria-expanded="false" aria-controls="langMenu" aria-label="Cambiar idioma" data-i18n-aria="aria_lang">
          <span class="flag" id="langFlag">🇪🇸</span><span id="langCode">ES</span>
        </button>
        <div class="lang-menu" id="langMenu">
          <button type="button" data-lang="es" lang="es"><span class="flag">🇪🇸</span> Español</button>
          <button type="button" data-lang="en" lang="en"><span class="flag">🇬🇧</span> English</button>
        </div>
      </div>

      <button type="button" class="burger" id="burgerBtn" aria-label="Abrir menú" data-i18n-aria="aria_menu" aria-expanded="false" aria-controls="navLinks">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </div>
</header>`,
    footer: `<footer>
  <div class="wrap">
    <div class="footer-top">
      <div class="f-brand">
        <a class="brand" href="#top">
          <span class="mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </span>
          <span class="brand-text">Taller de Chapa y Pintura<small>Software de gestión</small></span>
        </a>
        <p class="f-desc" data-i18n="f_desc">Software de gestión integral para talleres de chapa y pintura: recepción digital, peritaje de daños, seguimiento en tiempo real, vehículos de cortesía y entrega.</p>
      </div>

      <div class="footer-col">
        <h2 class="footer-h" data-i18n="f_col1">Producto</h2>
        <ul>
          <li><a href="#producto" data-i18n="f_l_feat">Características</a></li>
          <li><a href="#como-funciona" data-i18n="f_l_flow">Cómo funciona</a></li>
          <li><a href="#precios" data-i18n="f_l_price">Precios</a></li>
          <li><a href="#faq" data-i18n="f_l_faq">Preguntas frecuentes</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h2 class="footer-h" data-i18n="f_col2">Compañía</h2>
        <ul>
          <li><a href="#contacto" data-i18n="f_l_demo">Solicitar demo</a></li>
          <li><a data-cfg-email href="mailto:">hola@tallerdechapaypintura.com</a></li>
          <li><button type="button" data-legal-tab="aviso" data-i18n="f_legal">Aviso legal</button></li>
          <li><button type="button" data-legal-tab="privacidad" data-i18n="f_priv">Política de privacidad</button></li>
          <li><button type="button" data-legal-tab="cookies" data-i18n="f_cook">Política de cookies</button></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© <span id="year">2026</span> Taller de Chapa y Pintura · <span data-i18n="f_rights">Todos los derechos reservados.</span></span>
      <div class="socials">
        <a data-cfg-social="linkedin" href="#" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05C20.5 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9z"/></svg></a>
        <a data-cfg-social="instagram" href="#" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
      </div>
    </div>
  </div>
</footer>`,
    legal: `<div class="legal-modal" id="legalModal" role="dialog" aria-modal="true" aria-labelledby="legalTitle">
  <div class="legal-box">
    <div class="legal-head">
      <h3 id="legalTitle" data-i18n="legal_title">Información legal</h3>
      <button type="button" class="legal-close" id="legalClose" aria-label="Cerrar" data-i18n-aria="aria_close">&times;</button>
    </div>
    <div class="legal-tabs">
      <button type="button" class="legal-tab active" data-legal-panel="aviso" data-i18n="f_legal">Aviso legal</button>
      <button type="button" class="legal-tab" data-legal-panel="privacidad" data-i18n="f_priv">Política de privacidad</button>
      <button type="button" class="legal-tab" data-legal-panel="cookies" data-i18n="f_cook">Política de cookies</button>
    </div>
    <div class="legal-body">
      <div class="legal-panel active" id="legalPanelAviso">
        <h4 data-i18n="aviso_h">Aviso legal</h4>
        <p data-i18n="aviso_p1"></p>
        <p data-i18n="aviso_p2"></p>
        <p data-i18n="aviso_p3"></p>
        <p data-i18n="aviso_p4"></p>
      </div>
      <div class="legal-panel" id="legalPanelPrivacidad">
        <h4 data-i18n="priv_h1"></h4>
        <p data-i18n="priv_p1"></p>
        <h4 data-i18n="priv_h2"></h4>
        <ul>
          <li data-i18n="priv_l1"></li>
          <li data-i18n="priv_l2"></li>
          <li data-i18n="priv_l3"></li>
          <li data-i18n="priv_l4"></li>
        </ul>
        <h4 data-i18n="priv_h3"></h4>
        <p data-i18n="priv_p2"></p>
        <h4 data-i18n="priv_h4"></h4>
        <p data-i18n="priv_p3"></p>
        <h4 data-i18n="priv_h5"></h4>
        <p data-i18n="priv_p4"></p>
        <h4 data-i18n="priv_h6"></h4>
        <p data-i18n="priv_p5"></p>
      </div>
      <div class="legal-panel" id="legalPanelCookies">
        <h4 data-i18n="cook_h1"></h4>
        <p data-i18n="cook_p1"></p>
        <h4 data-i18n="cook_h2"></h4>
        <p data-i18n="cook_p2"></p>
        <h4 data-i18n="cook_h3"></h4>
        <ul>
          <li data-i18n="cook_l1"></li>
          <li data-i18n="cook_l2"></li>
          <li data-i18n="cook_l3"></li>
        </ul>
        <h4 data-i18n="cook_h4"></h4>
        <p data-i18n="cook_p3"></p>
      </div>
    </div>
  </div>
</div>`,
    totop: `<button type="button" class="to-top" id="toTop" aria-label="Volver arriba" data-i18n-aria="aria_top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>`,
  };

  /* En una página que no sea la portada, los enlaces de ancla
     (#precios, #contacto...) tienen que apuntar a la portada. Cada
     página lo declara con <body data-home="../index.html">; la
     portada no lleva el atributo. */
  var home = (document.body.getAttribute('data-home') || '').trim();

  Object.keys(LAYOUT).forEach(function (name) {
    document.querySelectorAll('[data-layout="' + name + '"]').forEach(function (slot) {
      slot.outerHTML = LAYOUT[name];
    });
  });

  if (home) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var hash = a.getAttribute('href');
      if (hash !== '#') a.setAttribute('href', home + hash);
    });
  }
})();
