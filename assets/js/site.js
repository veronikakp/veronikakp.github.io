/* Progressive enhancement only. HTML remains navigable without this file. */
(() => {
  'use strict';
  const base = document.documentElement.dataset.basePath || '';
  const preferenceKey = `portfolio-language:${base || '/'}`;
  const languageLinks = Array.from(document.querySelectorAll('[data-language]'));
  function remember(language) {
    try { window.localStorage.setItem(preferenceKey, language); } catch (_) { /* Private/storage-disabled modes. */ }
  }
  function updateLanguageLinks() {
    languageLinks.forEach(link => {
      const url = new URL(link.href);
      url.hash = window.location.hash;
      link.href = url.href;
    });
  }
  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);
  languageLinks.forEach(link => link.addEventListener('click', () => remember(link.dataset.language)));

  // URL language wins on /en/ and /es/. Redirect only the entry root.
  if (document.body.hasAttribute('data-language-entry')) {
    let stored;
    try { stored = window.localStorage.getItem(preferenceKey); } catch (_) { /* Use browser preference. */ }
    const preferred = stored === 'en' || stored === 'es'
      ? stored
      : ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
    const target = languageLinks.find(link => link.dataset.language === preferred);
    if (target && window.location.protocol !== 'file:') window.location.replace(target.href);
  }

  // Native details handles opening/closing; Escape is a small keyboard enhancement.
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open && menu.contains(document.activeElement)) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  }

  // Native hash navigation + tabindex provides a no-JS fallback.
  // Enhance focus after clicks and history/deep-link navigation without taking over scrolling.
  function focusHash() {
    if (!window.location.hash) return;
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
    const target = document.getElementById(id);
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({preventScroll: true});
  }
  window.addEventListener('hashchange', focusHash);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = new URL(link.href);
    if (target.pathname === window.location.pathname && target.origin === window.location.origin && target.hash) {
      if (menu && menu.contains(link)) menu.open = false;
      window.requestAnimationFrame(focusHash);
    }
  });
  focusHash();
})();
