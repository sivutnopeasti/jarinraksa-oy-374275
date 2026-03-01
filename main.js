/* ============================================
   JARIN RAKSA OY – MAIN.JS
   ============================================ */

'use strict';

/* ============================================
   HAMBURGER / MOBIILINAVIGAATIO
   ============================================ */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  if (!hamburger || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('click', handleOutsideClick);
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', handleEsc);
    document.removeEventListener('click', handleOutsideClick);
  }

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  function handleEsc(e) {
    if (e.key === 'Escape') {
      closeMenu();
      hamburger.focus();
    }
  }

  function handleOutsideClick(e) {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  // Sulje valikko kun klikataan nav-linkkiä
  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();


/* ============================================
   HEADER – SCROLL-VARJO
   ============================================ */
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      header.style.boxShadow = '0 4px 24px rgba(13,37,64,.15)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(13,37,64,.08)';
    }

    lastScroll = currentScroll;
  }, { passive: true });
})();


/* ============================================
   SCROLL ANIMATIONS – FADE IN
   ============================================ */
(function initScrollAnimations() {
  // Lisää fade-in-luokka animoitaville elementeille
  const targets = [
    '.palvelu-card',
    '.gallery-item',
    '.stat-item',
    '.meista-content',
    '.meista-visual',
    '.contact-info',
    '.contact-form-wrap',
    '.section-header',
  ];

  const elements = document.querySelectorAll(targets.join(', '));

  if (!elements.length) return;

  // Tarkista prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  elements.forEach(function (el) {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ============================================
   PALVELU-KORTIT – STAGGERED DELAY
   ============================================ */
(function initCardStagger() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const cards = document.querySelectorAll('.palvelu-card');
  cards.forEach(function (card, i) {
    card.style.transitionDelay = (i * 70) + 'ms';
  });

  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item, i) {
    item.style.transitionDelay = (i * 90) + 'ms';
  });
})();


/* ============================================
   HERO – PARALLAX-KEVYT
   ============================================ */
(function initHeroParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const heroBgImg = document.querySelector('.hero-bg-img');
  if (!heroBgImg) return;

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;
    heroBgImg.style.transform = 'translateY(' + (scrollY * 0.25) + 'px)';
  }, { passive: true });
})();


/* ============================================
   AKTIIVINEN NAVIGOINTILINKKI
   ============================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute('id');

      navLinks.forEach(function (link) {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + id) {
          link.classList.add('active');
        }
      });
    });
  }, {
    threshold: 0.35,
    rootMargin: '-80px 0px -60% 0px',
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // Lisää active-tyylit CSS-muuttujilla (ei erillistä CSS-muutosta)
  const style = document.createElement('style');
  style.textContent = '.nav-link.active { color: var(--blue); background: var(--off-white); }';
  document.head.appendChild(style);
})();


/* ============================================
   VUOSILUKU FOOTERIIN
   ============================================ */
(function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();


/* ============================================
   YHTEYDENOTTOLOMAKE
   ============================================ */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const feedback   = document.getElementById('form-feedback');
  const submitBtn  = document.getElementById('submit-btn');

  if (!form || !feedback || !submitBtn) return;

  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  // --- Validaatio ---
  function validateField(field) {
    const value = field.value.trim();
    let valid = true;

    if (field.hasAttribute('required') && !value) {
      valid = false;
    }

    if (field.type === 'email' && value) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) valid = false;
    }

    if (field.type === 'tel' && value) {
      const telRe = /^[\d\s\+\-\(\)]{6,20}$/;
      if (!telRe.test(value)) valid = false;
    }

    if (valid) {
      field.classList.remove('error');
      field.removeAttribute('aria-invalid');
    } else {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
    }

    return valid;
  }

  // Reaaliaikainen validaatio blur-tapahtumassa
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () {
      validateField(field);
    });

    field.addEventListener('input', function () {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  function validateAll() {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });
    return allValid;
  }

  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className   = 'form-feedback ' + type;
    feedback.hidden      = false;

    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Piilota onnistumisviesti 8 s kuluttua
    if (type === 'success') {
      setTimeout(function () {
        feedback.hidden = true;
      }, 8000);
    }
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      if (btnText)    btnText.hidden    = true;
      if (btnLoading) btnLoading.hidden = false;
    } else {
      submitBtn.disabled = false;
      if (btnText)    btnText.hidden    = false;
      if (btnLoading) btnLoading.hidden = true;
    }
  }

  // --- Lähetys ---
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    feedback.hidden = true;
    feedback.className = 'form-feedback';

    if (!validateAll()) {
      showFeedback('Tarkista punaisella merkityt kentät.', 'error');
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    setLoading(true);

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        showFeedback('Tarjouspyyntö lähetetty. Palaamme asiaan saman päivän aikana.', 'success');
        form.reset();
        form.querySelectorAll('.error').forEach(function (el) {
          el.classList.remove('error');
          el.removeAttribute('aria-invalid');
        });
      } else {
        const data = await response.json().catch(function () { return {}; });
        const msg  = (data.errors && data.errors[0] && data.errors[0].message)
          ? data.errors[0].message
          : 'Lähetys epäonnistui. Kokeile uudelleen tai soita suoraan.';
        showFeedback(msg, 'error');
      }
    } catch (err) {
      showFeedback('Verkkovirhe. Tarkista yhteys ja yritä uudelleen.', 'error');
    } finally {
      setLoading(false);
    }
  });
})();


/* ============================================
   GALLERIA – LIGHTBOX (kevyt)
   ============================================ */
(function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Luo lightbox-elementit
  const overlay = document.createElement('div');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Kuvan suurennus');
  overlay.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'z-index:1000',
    'background:rgba(10,20,35,.95)',
    'align-items:center',
    'justify-content:center',
    'cursor:zoom-out',
    'padding:1.5rem',
  ].join(';');

  const img = document.createElement('img');
  img.style.cssText = [
    'max-width:90vw',
    'max-height:88vh',
    'object-fit:contain',
    'border-radius:8px',
    'box-shadow:0 24px 80px rgba(0,0,0,.6)',
    'cursor:default',
    'user-select:none',
  ].join(';');
  img.setAttribute('alt', '');

  const caption = document.createElement('p');
  caption.style.cssText = [
    'position:absolute',
    'bottom:1.5rem',
    'left:50%',
    'transform:translateX(-50%)',
    'color:rgba(255,255,255,.75)',
    'font-size:.875rem',
    'font-family:Inter,sans-serif',
    'white-space:nowrap',
    'pointer-events:none',
  ].join(';');

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Sulje kuva');
  closeBtn.style.cssText = [
    'position:absolute',
    'top:1.25rem',
    'right:1.25rem',
    'background:rgba(255,255,255,.12)',
    'border:none',
    'color:#fff',
    'font-size:1.5rem',
    'width:42px',
    'height:42px',
    'border-radius:50%',
    'cursor:pointer',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'transition:background .2s',
    'line-height:1',
  ].join(';');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('mouseenter', function () {
    closeBtn.style.background = 'rgba(255,255,255,.25)';
  });
  closeBtn.addEventListener('mouseleave', function () {
    closeBtn.style.background = 'rgba(255,255,255,.12)';
  });

  overlay.appendChild(img);
  overlay.appendChild(caption);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  let previousFocus = null;

  function openLightbox(src, alt, captionText) {
    previousFocus = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    caption.textContent = captionText || '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    img.src = '';
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  // Klikkaus-avaus
  galleryItems.forEach(function (item) {
    const galleryImg = item.querySelector('.gallery-img');
    const figcaption = item.querySelector('figcaption');
    if (!galleryImg) return;

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Suurenna kuva: ' + (figcaption ? figcaption.textContent : ''));
    item.style.cursor = 'zoom-in';

    function trigger() {
      openLightbox(galleryImg.src, galleryImg.alt, figcaption ? figcaption.textContent : '');
    }

    item.addEventListener('click', trigger);
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  // Sulkeminen
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeLightbox();
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeLightbox();
    }
  });
})();