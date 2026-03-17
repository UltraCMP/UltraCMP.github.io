/* =========================================
   ULTRA COMPONENTS – script.js
   ========================================= */

/* ================================================================
   EMAILJS CONFIG — Sostituisci i tre valori dopo aver creato
   il tuo account su https://www.emailjs.com
   ================================================================ */
const EMAILJS_PUBLIC_KEY = 'wLkA5e6Nod99ZP74L';   // Account → API Keys
const EMAILJS_SERVICE_ID = 'service_q8cyx4n';   // Email Services → ID
const EMAILJS_TEMPLATE_ID = 'template_6mcaywg';  // Email Templates → ID

// Inizializza EmailJS con la tua Public Key
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---- AOS – Animate On Scroll ---- */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.aosDelay ? parseInt(el.dataset.aosDelay) : 0;
        setTimeout(() => el.classList.add('aos-animate'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
}
initAOS();

/* ---- Counter animation ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ---- Form submit con EmailJS ---- */
function handleSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const error = document.getElementById('formError');

  // Leggi i valori
  const name = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const service = document.getElementById('formService').value;
  const message = document.getElementById('formMessage').value.trim();

  // Validazione base
  if (!name || !email || !message) {
    shakeForm();
    return;
  }

  // Stato caricamento
  btn.textContent = '⏳ Invio in corso...';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  if (error) error.classList.remove('show');

  // Mappa i parametri del template EmailJS
  const templateParams = {
    from_name: name,
    from_email: email,
    service_type: service || 'Non specificato',
    message: message,
    to_email: 'ultracomponents20@gmail.com',
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      // Successo
      btn.textContent = 'Invia Messaggio';
      btn.disabled = false;
      btn.style.opacity = '';
      success.classList.add('show');
      document.getElementById('contactForm').reset();
      setTimeout(() => success.classList.remove('show'), 6000);
    })
    .catch((err) => {
      // Errore
      console.error('EmailJS error:', err);
      btn.textContent = 'Invia Messaggio';
      btn.disabled = false;
      btn.style.opacity = '';
      if (error) {
        error.classList.add('show');
        setTimeout(() => error.classList.remove('show'), 6000);
      }
    });
}

/* Animazione shake in caso di validazione fallita */
function shakeForm() {
  const form = document.getElementById('contactForm');
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => form.style.animation = '', 400);
}

/* ---- Active nav link ---- */
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { passive: true });

/* ---- Parallax blob ---- */
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  document.querySelectorAll('.blob').forEach((blob, i) => {
    const factor = (i + 1) * 0.4;
    blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
}, { passive: true });
