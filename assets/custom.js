/* =========================================================
   MOBILE MENU PARENT LINK FIX
   ---------------------------------------------------------
   Install:
     1. Assets ma "mobile-menu-link-fix.js" naame save karo
     2. theme.liquid ma </body> pehla add karo:
        <script src="{{ 'mobile-menu-link-fix.js' | asset_url }}" defer></script>
     3. Niche CONFIG ma tamara theme na selectors bharo

   Selectors kevi rite shodhva:
     Mobile view ma "Plants" ke "Indoor Plants" par right-click
     -> Inspect. Je element highlight thay tena class copy karo.
   ========================================================= */

(function () {
  'use strict';

  var CONFIG = {
    // Mobile drawer no outer wrapper.
    // Dawn-based themes: 'header-drawer', '.menu-drawer'
    // Ekthi vadhu hoy to comma thi alag karo.
    drawer: '.menu-drawer, header-drawer, .mobile-menu, .drawer__menu',

    // Je element ma parent item nu naam che (Plants / Indoor Plants).
    // Aa element ni ander athva aa j element par href hovo joie.
    parent: 'summary, .menu-drawer__menu-item--parent, .mobile-menu__parent',

    // Parent nu submenu container (jya children <li> che).
    submenu: 'ul, .menu-drawer__submenu, .mobile-menu__submenu',

    // Mode:
    //   'viewall'  -> submenu ni upar "View all X" row umere (SAFE, recommended)
    //   'redirect' -> parent text par tap = direct redirect (accordion nahi khule)
    mode: 'viewall',

    viewAllLabel: 'View all',
    breakpoint: 989
  };

  function isMobile() {
    return window.innerWidth <= CONFIG.breakpoint;
  }

  // Element par athva tena ander thi first usable href kadho
  function getHref(el) {
    var anchor = el.matches('a') ? el : el.querySelector('a[href]');
    if (!anchor) return null;

    var href = anchor.getAttribute('href');
    if (!href || href === '#' || href.indexOf('javascript:') === 0) return null;

    return href;
  }

  function labelOf(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /* ---------- MODE: viewall ---------- */
  function injectViewAll(drawer) {
    var parents = drawer.querySelectorAll(CONFIG.parent);

    Array.prototype.forEach.call(parents, function (parent) {
      if (parent.dataset.viewAllDone) return;

      var href = getHref(parent);
      if (!href) return;

      // Submenu parent na bhaai (sibling) ma ke parent na container ma shodho
      var scope = parent.parentElement;
      if (!scope) return;

      var submenu = scope.querySelector(CONFIG.submenu);
      if (!submenu) return;

      // Already same href valo link submenu ma hoy to skip
      if (submenu.querySelector('a[href="' + href + '"]')) {
        parent.dataset.viewAllDone = '1';
        return;
      }

      var li = document.createElement('li');
      li.className = 'mobile-menu__view-all';

      var a = document.createElement('a');
      a.href = href;
      a.textContent = CONFIG.viewAllLabel + ' ' + labelOf(parent);
      a.style.fontWeight = '600';
      a.style.textDecoration = 'underline';

      li.appendChild(a);
      submenu.insertBefore(li, submenu.firstChild);

      parent.dataset.viewAllDone = '1';
    });
  }

  /* ---------- MODE: redirect ---------- */
  function bindRedirect(drawer) {
    if (drawer.dataset.redirectBound) return;
    drawer.dataset.redirectBound = '1';

    drawer.addEventListener(
      'click',
      function (event) {
        if (!isMobile()) return;

        var parent = event.target.closest(CONFIG.parent);
        if (!parent || !drawer.contains(parent)) return;

        // Chevron / arrow icon par tap hoy to accordion j chalva do
        if (event.target.closest('svg, .icon, .caret, [class*="arrow"]')) return;

        var href = getHref(parent);
        if (!href) return;

        event.preventDefault();
        event.stopPropagation();
        window.location.href = href;
      },
      true // capture — theme na handlers pehla chale
    );
  }

  function run() {
    var drawers = document.querySelectorAll(CONFIG.drawer);
    if (!drawers.length) {
      console.warn('[mobile-menu-link-fix] Drawer no mayo. CONFIG.drawer check karo.');
      return;
    }

    Array.prototype.forEach.call(drawers, function (drawer) {
      if (CONFIG.mode === 'redirect') {
        bindRedirect(drawer);
      } else {
        injectViewAll(drawer);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', run);

  // Drawer late render thay ke Shopify editor ma section reload thay tyare pan chale
  document.addEventListener('shopify:section:load', run);
  window.addEventListener('resize', function () {
    if (CONFIG.mode === 'viewall') run();
  });
})();
