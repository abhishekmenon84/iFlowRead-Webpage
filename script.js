(() => {
  "use strict";

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    const delay = reducedMotion ? 0 : 1900;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-hidden'), delay);
    });
  }

  /* ---------- Nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reducedMotion) {
      revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      }, { threshold: 0.15 });
      revealEls.forEach(el => revealObserver.observe(el));
    }
  }

  /* ---------- Section navigation (labeled) ---------- */
  const navItems = document.querySelectorAll('.section-nav__item');
  if (navItems.length) {
    const ids = Array.from(navItems).map(item => item.dataset.target);
    const sectionEls = ids.map(id => document.getElementById(id)).filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const idx = ids.indexOf(id);
          if (idx > -1) {
            navItems.forEach(item => item.classList.remove('is-active'));
            navItems[idx].classList.add('is-active');
          }
        }
      });
    }, { threshold: 0.5 });

    sectionEls.forEach(el => sectionObserver.observe(el));

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(item.dataset.target);
        if (target) target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- Teleprompter word highlight ---------- */
  const words = document.querySelectorAll('#teleLines .word');
  if (words.length && !reducedMotion) {
    let i = 0;
    words[0].classList.add('active');
    setInterval(() => {
      words[i].classList.remove('active');
      i = (i + 1) % words.length;
      words[i].classList.add('active');
    }, 420);
  }

  /* ---------- Sparkles (Aceternity-style ambient particles) ---------- */
  function initSparkles(id, colors, density) {
    const el = document.getElementById(id);
    if (!el || reducedMotion || typeof window.tsParticles === 'undefined') return;

    window.tsParticles.load({
      id,
      options: {
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: {
            value: density,
            density: { enable: true, width: 600, height: 600 }
          },
          color: { value: colors },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.08, max: 0.7 },
            animation: { enable: true, speed: 1, sync: false, startValue: 'random' }
          },
          size: { value: { min: 0.6, max: 1.8 } },
          links: { enable: false },
          move: {
            enable: true,
            speed: 0.25,
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'out' }
          }
        },
        interactivity: {
          events: { onHover: { enable: false }, onClick: { enable: false } }
        }
      }
    }).catch(() => { /* fail silently if particles can't load */ });
  }

  initSparkles('sparkles-hero', ['#F5A623', '#A368FF', '#FFC56B'], 60);
  initSparkles('sparkles-begin', ['#F5A623', '#C77DFF', '#A368FF'], 70);

  /* ---------- Pricing: monthly / yearly toggle ---------- */
  const periodBtns = document.querySelectorAll('.period-btn');
  const priceCards = document.querySelectorAll('.price-card');
  if (periodBtns.length && priceCards.length) {
    const applyPeriod = (period) => {
      priceCards.forEach(card => {
        const amountEl = card.querySelector('.amount');
        const periodEl = card.querySelector('.period');
        const noteEl = card.querySelector('.billed-note');
        const monthly = parseFloat(card.dataset.monthly);
        const yearly = parseFloat(card.dataset.yearly);
        if (!amountEl || !periodEl) return;

        if (period === 'monthly') {
          amountEl.textContent = '$' + monthly.toFixed(2);
          periodEl.textContent = '/ month';
          if (noteEl) noteEl.textContent = 'Billed monthly · cancel anytime';
        } else {
          amountEl.textContent = '$' + yearly.toFixed(2);
          periodEl.textContent = '/ year';
          if (noteEl) noteEl.textContent = 'Billed annually · works out to $' + (yearly / 12).toFixed(2) + '/mo';
        }
      });
    };

    periodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        periodBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyPeriod(btn.dataset.period);
      });
    });
  }

  /* ---------- Contact form (Netlify Forms compatible, progressive enhancement) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const statusEl = document.getElementById('contactStatus');

    const showStatus = (message, type) => {
      if (!statusEl) return;
      statusEl.textContent = message; // textContent only — never innerHTML, avoids XSS
      statusEl.className = 'form-status ' + (type === 'error' ? 'is-error' : 'is-success');
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot spam check — bots tend to fill every field
      const honeypot = contactForm.querySelector('input[name="bot-field"]');
      if (honeypot && honeypot.value) {
        showStatus('Something went wrong. Please try again.', 'error');
        return;
      }

      // Basic client-side validation (server-side validation still required)
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        showStatus('Please fill in your name, email, and message.', 'error');
        return;
      }
      if (!emailPattern.test(email.value.trim())) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.setAttribute('disabled', 'true');

      const data = new FormData(contactForm);
      fetch(contactForm.action || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      })
        .then(() => {
          showStatus("Thanks — your message is on its way. We'll reply within 1–2 business days.", 'success');
          contactForm.reset();
        })
        .catch(() => {
          showStatus("We couldn't send that automatically. Please email us directly at support@iflowread.com.", 'error');
        })
        .finally(() => {
          if (submitBtn) submitBtn.removeAttribute('disabled');
        });
    });
  }
  /* ---------- Feedback form (homepage, Formspree) ---------- */
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    const successEl = document.getElementById('feedbackSuccess');
    const submitBtn = document.getElementById('fbSubmit');

    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = feedbackForm.querySelector('#fb-message');
      if (!msg || !msg.value.trim()) {
        msg && msg.focus();
        return;
      }
      if (submitBtn) submitBtn.setAttribute('disabled', 'true');

      const data = new FormData(feedbackForm);
      fetch(feedbackForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
        .then(res => {
          if (res.ok) {
            feedbackForm.reset();
            if (successEl) successEl.hidden = false;
          } else {
            alert("Couldn't send — please email us at support@iflowread.com");
          }
        })
        .catch(() => alert("Couldn't send — please email us at support@iflowread.com"))
        .finally(() => { if (submitBtn) submitBtn.removeAttribute('disabled'); });
    });
  }
})();
