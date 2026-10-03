/* ============================================================
   Comportamiento del sitio: cabecera, menú móvil, idioma,
   FAQ, modal legal, datos de contacto y formulario de demo.
   Depende de: assets/config.js, assets/i18n.js
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var FLAGS = { es: '🇪🇸', en: '🇬🇧' };
  /* Páginas como /gracias o /thank-you existen en un solo idioma y lo
     fijan con <body data-lang-lock="es|en">; el resto recuerda la
     elección del visitante. */
  var langLock = document.body.getAttribute('data-lang-lock');
  var langAlt = document.body.getAttribute('data-lang-alt');
  var currentLang = langLock || localStorage.getItem('tdc_lang') || (navigator.language || 'es').slice(0, 2);
  if (!I18N[currentLang]) currentLang = 'es';

  function t(key) {
    var dict = I18N[currentLang] || I18N.es;
    return dict[key] !== undefined ? dict[key] : (I18N.es[key] !== undefined ? I18N.es[key] : key);
  }

  /* ---------- Año en el pie ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Cabecera y botón "arriba" ---------- */
  var header = document.getElementById('site-header');
  var toTop = document.getElementById('toTop');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById('burgerBtn');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- FAQ (acordeón) ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        other.classList.remove('open');
        var oq = other.querySelector('.faq-q');
        if (oq) oq.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Modal legal ---------- */
  var legalModal = document.getElementById('legalModal');
  if (legalModal) {
    var panels = {
      aviso: document.getElementById('legalPanelAviso'),
      privacidad: document.getElementById('legalPanelPrivacidad'),
      cookies: document.getElementById('legalPanelCookies'),
    };
    var closeBtn = document.getElementById('legalClose');
    /* Al abrir, el foco entra en el modal; al cerrar, vuelve al botón
       que lo abrió. */
    var lastFocus = null;
    var openLegal = function (tab) {
      if (!legalModal.classList.contains('open')) lastFocus = document.activeElement;
      legalModal.classList.add('open');
      document.querySelectorAll('.legal-tab').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-legal-panel') === tab);
      });
      Object.keys(panels).forEach(function (key) {
        if (panels[key]) panels[key].classList.toggle('active', key === tab);
      });
      if (closeBtn) closeBtn.focus();
    };
    var closeLegal = function () {
      if (!legalModal.classList.contains('open')) return;
      legalModal.classList.remove('open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    document.querySelectorAll('[data-legal-tab]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openLegal(btn.getAttribute('data-legal-tab'));
      });
    });
    document.querySelectorAll('.legal-tab').forEach(function (btn) {
      btn.addEventListener('click', function () { openLegal(btn.getAttribute('data-legal-panel')); });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeLegal);
    legalModal.addEventListener('click', function (e) {
      if (e.target === legalModal) closeLegal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLegal();
      /* Mientras está abierto, el tabulador no sale del modal. */
      if (e.key === 'Tab' && legalModal.classList.contains('open')) {
        var f = legalModal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Datos de contacto desde config.js ---------- */
  function applyContactData() {
    document.querySelectorAll('[data-cfg-phone]').forEach(function (el) {
      el.textContent = CFG.phone || '';
      if (el.tagName === 'A') el.href = 'tel:' + (CFG.phoneHref || '');
    });
    document.querySelectorAll('[data-cfg-tel]').forEach(function (el) {
      el.href = 'tel:' + (CFG.phoneHref || '');
    });
    document.querySelectorAll('[data-cfg-wa]').forEach(function (el) {
      el.href = 'https://wa.me/' + (CFG.whatsapp || '');
    });
    document.querySelectorAll('[data-cfg-email]').forEach(function (el) {
      el.textContent = CFG.email || '';
      el.href = 'mailto:' + (CFG.email || '');
    });
    document.querySelectorAll('[data-cfg-address]').forEach(function (el) {
      el.textContent = CFG.address || '';
    });
    document.querySelectorAll('[data-cfg-social]').forEach(function (el) {
      var key = el.getAttribute('data-cfg-social');
      if (CFG[key]) { el.href = CFG[key]; } else { el.style.display = 'none'; }
    });
  }

  /* ---------- Idioma ---------- */
  function applyTranslations(lang) {
    var dict = I18N[lang] || I18N.es;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
    });
    document.documentElement.lang = lang;
    var flag = document.getElementById('langFlag');
    var code = document.getElementById('langCode');
    if (flag) flag.textContent = FLAGS[lang] || '';
    if (code) code.textContent = lang.toUpperCase();
    document.querySelectorAll('.lang-menu button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    if (!langLock) localStorage.setItem('tdc_lang', lang);
    applyTranslations(lang);
    applyContactData();
  }

  var langSwitch = document.getElementById('langSwitch');
  var langBtn = document.getElementById('langBtn');
  if (langSwitch && langBtn) {
    var setLangOpen = function (open) {
      langSwitch.classList.toggle('open', open);
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setLangOpen(!langSwitch.classList.contains('open'));
    });
    document.querySelectorAll('.lang-menu button').forEach(function (b) {
      b.addEventListener('click', function () {
        var lang = b.getAttribute('data-lang');
        /* En una página de un solo idioma, cambiar de idioma es ir a su
           equivalente, no traducir la página a medias. */
        if (langLock && langAlt && lang !== langLock) {
          localStorage.setItem('tdc_lang', lang);
          location.href = langAlt;
          return;
        }
        setLanguage(lang);
        setLangOpen(false);
      });
    });
    document.addEventListener('click', function (e) {
      if (!langSwitch.contains(e.target)) setLangOpen(false);
    });
  }

  /* ---------- Validación del formulario ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  var PHONE_RE = /^[0-9]{6,15}$/;

  function showFieldError(el, msg) {
    el.classList.add('invalid');
    el.setAttribute('aria-invalid', 'true');
    var err = document.getElementById(el.id + '_err');
    if (err) { err.textContent = msg; err.classList.add('show'); }
  }
  function clearFieldError(el) {
    el.classList.remove('invalid');
    el.removeAttribute('aria-invalid');
    var err = document.getElementById(el.id + '_err');
    if (err) err.classList.remove('show');
  }
  function validateField(def) {
    var el = def.el;
    var value = (el.value || '').trim();
    clearFieldError(el);
    if (!value) { showFieldError(el, t('err_required')); return false; }
    if (def.type === 'email' && !EMAIL_RE.test(value)) { showFieldError(el, t('err_email')); return false; }
    if (def.type === 'phone' && !PHONE_RE.test(value.replace(/[\s.\-()]/g, ''))) { showFieldError(el, t('err_phone')); return false; }
    return true;
  }

  function setStatus(el, kind, html) {
    if (!el) return;
    el.className = 'form-status show ' + kind;
    el.innerHTML = html;
  }
  function clearStatus(el) {
    if (!el) return;
    el.className = 'form-status';
    el.innerHTML = '';
  }
  function errorStatusHTML() {
    return '<span>' + t('status_error_intro') + ' ' +
      '<a href="tel:' + (CFG.phoneHref || '') + '">' + t('status_error_call') + '</a> · ' +
      '<a href="https://wa.me/' + (CFG.whatsapp || '') + '" target="_blank" rel="noopener">' + t('status_error_wa') + '</a> · ' +
      t('status_error_email') + ' <a href="mailto:' + (CFG.email || '') + '">' + (CFG.email || '') + '</a></span>';
  }

  /* ---------- Envío del formulario ----------
     Va al CRM: POST multipart a <base><id>/submit con los nombres de
     campo que define el propio formulario del CRM. El id depende del
     tipo de formulario y del idioma activo.                          */
  function endpointFor(kind) {
    var f = CFG.form || {};
    var ids = (f.ids || {})[kind] || {};
    var id = ids[currentLang] || ids.es;
    return (f.mode === 'endpoint' && f.base && id) ? f.base + id + '/submit' : null;
  }

  function sendForm(kind, data) {
    var url = endpointFor(kind);
    if (!url) return Promise.reject(new Error('form-not-configured'));

    var map = (CFG.form || {}).fieldMap || {};
    var fd = new FormData();
    fd.append('formId', url.split('/form/')[1].replace('/submit', ''));
    Object.keys(data).forEach(function (k) {
      fd.append(map[k] || k, data[k]);
    });
    fd.append('browser', JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      origin: location.origin,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }));
    fd.append('location', location.href);

    return fetch(url, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res;
      });
  }

  var form = document.getElementById('demoForm');
  if (form) {
    var statusEl = document.getElementById('d_status');
    var captchaInput = document.getElementById('d_captcha');
    var captchaMsg = document.getElementById('d_captcha_msg');
    var consent = document.getElementById('d_consent');
    var consentErr = document.getElementById('d_consent_err');
    var submitBtn = form.querySelector('button[type="submit"]');

    var fieldDefs = [
      { id: 'd_name', type: 'text' },
      { id: 'd_shop', type: 'text' },
      { id: 'd_email', type: 'email' },
      { id: 'd_phone', type: 'phone' },
      { id: 'd_size', type: 'text' },
    ].map(function (f) { return { el: document.getElementById(f.id), type: f.type }; })
     .filter(function (f) { return f.el; });

    fieldDefs.forEach(function (def) {
      def.el.addEventListener('input', function () { clearFieldError(def.el); });
      def.el.addEventListener('change', function () { clearFieldError(def.el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearStatus(statusEl);
      if (captchaMsg) captchaMsg.classList.remove('show');
      if (consentErr) consentErr.classList.remove('show');

      var fieldsOk = fieldDefs.map(validateField).every(Boolean);
      var answer = (captchaInput ? captchaInput.value : '').trim().toLowerCase();
      var captchaOk = (CFG.captchaAnswers || []).indexOf(answer) !== -1;
      var consentOk = consent ? consent.checked : true;

      if (captchaInput) captchaInput.setAttribute('aria-invalid', captchaOk ? 'false' : 'true');
      if (!captchaOk && captchaMsg) captchaMsg.classList.add('show');
      if (consent) consent.setAttribute('aria-invalid', consentOk ? 'false' : 'true');
      if (!consentOk && consentErr) { consentErr.textContent = t('err_consent'); consentErr.classList.add('show'); }
      /* Lleva el foco al primer campo con error para que se anuncie. */
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      if (!fieldsOk || !captchaOk || !consentOk) return;

      var get = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
      /* El desplegable manda el texto que ve el visitante, que es
         exactamente una de las opciones definidas en el CRM. */
      var sizeSel = document.getElementById('d_size');
      var data = {
        name:    get('d_name'),
        shop:    get('d_shop'),
        email:   get('d_email'),
        phone:   get('d_phone'),
        size:    sizeSel && sizeSel.selectedIndex > 0 ? sizeSel.options[sizeSel.selectedIndex].textContent.trim() : '',
        message: get('d_message'),
        consent: consent && consent.checked ? '1' : '',
      };

      setStatus(statusEl, 'sending', t('status_sending'));
      if (submitBtn) submitBtn.disabled = true;

      sendForm(form.getAttribute('data-form-kind') || 'demo', data)
        .then(function () {
          /* La página de agradecimiento de cada idioma es además la URL
             de conversión. La declara cada página con <body data-thanks>. */
          var thanks = document.body.getAttribute('data-thanks');
          if (thanks) { location.href = thanks; return; }
          if (submitBtn) submitBtn.disabled = false;
          setStatus(statusEl, 'success', t('status_success'));
          form.reset();
        })
        .catch(function (err) {
          if (submitBtn) submitBtn.disabled = false;
          setStatus(statusEl, 'error', errorStatusHTML());
          if (err && err.message === 'form-not-configured') {
            console.warn('[Taller de Chapa y Pintura] Envío del formulario sin configurar: revisa form.mode en assets/config.js');
          } else {
            console.error('[Taller de Chapa y Pintura] Error al enviar el formulario:', err);
          }
        });
    });
  }

  /* ---------- Arranque ---------- */
  setLanguage(currentLang);
})();
