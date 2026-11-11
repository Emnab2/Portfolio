/* ==========================================================================
   Portfolio — Emna Brahmi
   Script principal (JavaScript simple, sans dépendance). Contient :
     1. Bascule mode clair / mode sombre (mémorisée dans le navigateur)
     2. Menu mobile (ouverture, fermeture, touche Échap)
     3. Mise en évidence du lien de la section visible
     4. Bordure de l'en-tête au défilement
     5. Animations d'apparition des sections
     6. Bouton « Copier l'adresse e-mail »
     7. Année du pied de page
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


  /* ------------------------------------------------------------------------
     1. THÈME CLAIR / SOMBRE
     Le thème initial est posé dans <head> (voir index.html) pour éviter un
     flash. Ici, on gère seulement le clic sur le bouton.
     ------------------------------------------------------------------------ */
  var themeBtn = document.querySelector('.theme-toggle');
  var themeColorMetas = document.querySelectorAll('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var next = theme === 'dark' ? 'clair' : 'sombre';
    themeBtn.setAttribute('aria-label', 'Activer le mode ' + next);
    themeBtn.setAttribute('title', 'Activer le mode ' + next);
    // Couleur de la barre du navigateur mobile
    var color = theme === 'dark' ? '#111315' : '#f6f5f1';
    themeColorMetas.forEach(function (meta) { meta.setAttribute('content', color); });
  }

  if (themeBtn) {
    applyTheme(root.getAttribute('data-theme') || 'light');
    themeBtn.addEventListener('click', function () {
      var theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      try { localStorage.setItem('theme', theme); } catch (e) { /* stockage indisponible : pas grave */ }
    });
  }


  /* ------------------------------------------------------------------------
     2. MENU MOBILE
     ------------------------------------------------------------------------ */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navMenu.classList.toggle('is-open', open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Fermer le menu après un clic sur un lien
    navMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    // Fermer avec Échap et rendre le focus au bouton
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus();
      }
    });

    // Fermer en cliquant en dehors du menu
    document.addEventListener('click', function (event) {
      if (navMenu.classList.contains('is-open') && !event.target.closest('.nav')) setMenu(false);
    });

    // Si l'écran s'agrandit (rotation de tablette…), on referme le menu
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }


  /* ------------------------------------------------------------------------
     3. LIEN ACTIF DANS LA NAVIGATION
     On observe chaque section : celle qui traverse le milieu de l'écran
     devient « active ».
     ------------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });

    // Dans l'accueil, aucun lien n'est actif
    var hero = document.getElementById('accueil');
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          navLinks.forEach(function (link) { link.removeAttribute('aria-current'); });
        }
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }
  }


  /* ------------------------------------------------------------------------
     4. EN-TÊTE : filet inférieur dès que l'on a défilé
     ------------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  if (header) {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ------------------------------------------------------------------------
     5. APPARITION DES SECTIONS
     Les éléments [data-reveal] reçoivent .is-visible quand ils entrent à
     l'écran. Le CSS ne les masque que si les animations sont autorisées.
     ------------------------------------------------------------------------ */
  var revealItems = document.querySelectorAll('[data-reveal]');

  function showAll() {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var revealer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // une seule fois
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach(function (el) { revealer.observe(el); });
  }

  // Avant une impression, tout doit être visible
  window.addEventListener('beforeprint', showAll);


  /* ------------------------------------------------------------------------
     6. COPIER L'ADRESSE E-MAIL
     ------------------------------------------------------------------------ */
  var copyBtn = document.querySelector('.copy-btn');
  var copyStatus = document.querySelector('.copy-status');

  // Solution de secours pour les navigateurs sans API Clipboard
  function legacyCopy(text) {
    var field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(field);
    return ok;
  }

  if (copyBtn) {
    var label = copyBtn.querySelector('.copy-label');
    var resetTimer;

    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-copy');

      function done(ok) {
        clearTimeout(resetTimer);
        if (ok) {
          copyBtn.classList.add('is-copied');
          label.textContent = 'Adresse copiée';
          copyStatus.textContent = 'L’adresse ' + text + ' a été copiée dans le presse-papiers.';
        } else {
          copyStatus.textContent = 'Copie impossible : sélectionnez l’adresse ci-dessus manuellement.';
        }
        resetTimer = setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          label.textContent = 'Copier l’adresse';
          copyStatus.textContent = '';
        }, 3000);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { done(true); },
          function () { done(legacyCopy(text)); }
        );
      } else {
        done(legacyCopy(text));
      }
    });
  }


  /* ------------------------------------------------------------------------
     7. ANNÉE DU PIED DE PAGE (mise à jour automatique)
     ------------------------------------------------------------------------ */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
