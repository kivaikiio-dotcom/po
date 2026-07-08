/**
 * Policy Oracle Limited — Main Script
 * Vanilla ES6+ · No dependencies
 * ──────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ──────────────────────────────────────────────
   * 1. NAVBAR SCROLL EFFECT
   *    Swap from transparent → solid after 80 px
   * ────────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  const handleNavbarScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // set initial state on load

  /* ──────────────────────────────────────────────
   * 2. MOBILE MENU TOGGLE
   *    • Toggle .active on .nav-links
   *    • Toggle .menu-open on .nav-toggle
   *    • Close when a link is clicked
   * ────────────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  const closeMenu = () => {
    navLinks?.classList.remove('active');
    navToggle?.classList.remove('menu-open');
  };

  navToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    navToggle.classList.toggle('menu-open');
  });

  // Close menu when any nav link is clicked (mobile UX)
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ──────────────────────────────────────────────
   * 3. SMOOTH SCROLLING
   *    Offset accounts for the fixed navbar (80 px)
   * ────────────────────────────────────────────── */
  const NAVBAR_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // skip bare '#' links

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top
                + window.scrollY
                - NAVBAR_OFFSET;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────────
   * 4. SCROLL ANIMATIONS  (IntersectionObserver)
   *    .animate-on-scroll → add .visible on enter
   *    Supports data-delay for staggered timing
   * ────────────────────────────────────────────── */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');

  if (animatedEls.length) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const el    = entry.target;
          const delay = el.dataset.delay || 0;

          setTimeout(() => el.classList.add('visible'), Number(delay));
          scrollObserver.unobserve(el); // fire once
        });
      },
      { threshold: 0.15 }
    );

    animatedEls.forEach(el => scrollObserver.observe(el));
  }

  /* ──────────────────────────────────────────────
   * 5. ANIMATED COUNTERS
   *    Uses requestAnimationFrame for smooth ~2 s
   *    count from 0 → data-target. Formats with
   *    commas and appends optional data-suffix.
   * ────────────────────────────────────────────── */
  const counters = document.querySelectorAll('.counter');

  /**
   * Format a number with locale-style commas.
   * e.g. 1990 → "1,990"
   */
  const formatNumber = (n) => Math.floor(n).toLocaleString('en-US');

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.target) || 0;
    const suffix   = el.dataset.suffix || '';
    const duration = 2000; // ms
    let start      = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      // Ease-out quad for a natural feel
      const eased = 1 - (1 - progress) ** 2;
      const current = eased * target;

      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ──────────────────────────────────────────────
   * 6. SERVICE ACCORDIONS
   *    Only one open at a time. Toggle .active on
   *    .service-card; .toggle-icon rotates via CSS.
   * ────────────────────────────────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    const header = card.querySelector('.service-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = card.classList.contains('active');

      // Close every card first (accordion behaviour)
      serviceCards.forEach(c => c.classList.remove('active'));

      // Re-open the clicked card only if it was closed
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  /* ──────────────────────────────────────────────
   * 7. TRAINING COURSE TABS / FILTER
   *    .filter-btn[data-category] filters
   *    course cards by their data-category.
   * ────────────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const courseCards  = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // Move active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      courseCards.forEach(card => {
        const matches = category === 'all' || card.dataset.category === category;

        if (matches) {
          card.style.display = '';
          // Trigger reflow then fade in
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          // Hide after the transition finishes
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  /* ──────────────────────────────────────────────
   * 8. ACTIVE NAV HIGHLIGHTING
   *    Highlight the link whose section is in view.
   * ────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && allNavLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute('id');

          allNavLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        });
      },
      {
        rootMargin: `-${NAVBAR_OFFSET}px 0px -40% 0px`,
        threshold: 0
      }
    );

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  /* ──────────────────────────────────────────────
   * 9. CONTACT FORM — basic validation & feedback
   * ────────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather required fields
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      // Remove prior error state
      field.classList.remove('input-error');

      if (!field.value.trim()) {
        field.classList.add('input-error');
        isValid = false;
      }

      // Basic email pattern check
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          field.classList.add('input-error');
          isValid = false;
        }
      }
    });

    if (!isValid) return;

    // Show a brief success message
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.textContent = 'Thank you! Your message has been sent.';
    contactForm.appendChild(successMsg);

    // Fade in
    requestAnimationFrame(() => successMsg.classList.add('visible'));

    // Reset form
    contactForm.reset();

    // Remove message after 4 s
    setTimeout(() => {
      successMsg.classList.remove('visible');
      setTimeout(() => successMsg.remove(), 500);
    }, 4000);
  });

  /* ──────────────────────────────────────────────
   * 10. PARALLAX — subtle hero depth effect
   *     Translate .hero-bg by scrollY × 0.3
   * ────────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg) {
    const handleParallax = () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /* ──────────────────────────────────────────────
   * 11. BACK TO TOP BUTTON
   *     Visible after 500 px of scroll
   * ────────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────
   * 12. TYPING EFFECT — hero subtitle
   *     .typing-text types out character by character
   * ────────────────────────────────────────────── */
  const typingEl = document.querySelector('.typing-text');

  if (typingEl) {
    const fullText = typingEl.textContent.trim();
    typingEl.textContent = '';
    typingEl.style.visibility = 'visible'; // un-hide after clearing

    let charIndex = 0;
    const typingSpeed = 50; // ms per character

    const type = () => {
      if (charIndex < fullText.length) {
        typingEl.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
      }
    };

    // Slight initial delay so the page settles
    setTimeout(type, 600);
  }
});
