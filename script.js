// ===== Year in footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Theme toggle (persisted) =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme', 'dark');

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Project filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const tags = card.dataset.tags || '';
      const show = filter === 'all' || tags.includes(filter);
      card.classList.toggle('is-hidden', !show);
    });
  });
});

// ===== Contact form (front-end only — no backend configured) =====

<script>
  const form = document.querySelector('.contact-container form');
  const formNote = document.getElementById('formNote');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevents the browser from navigating away
    formNote.textContent = 'Sending...';
    formNote.style.color = '#4f46e5';

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formNote.textContent = 'Thanks! Your message has been sent.';
        formNote.style.color = '#16a34a'; // Success green
        form.reset(); // Clears the form fields
      } else {
        const errorData = await response.json();
        formNote.textContent = errorData.error || 'Oops! There was a problem submitting your form.';
        formNote.style.color = '#dc2626'; // Error red
      }
    } catch (error) {
      formNote.textContent = 'Oops! There was a connection problem.';
      formNote.style.color = '#dc2626';
    }
  });
</script>

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'This form is a UI demo only — connect it to a service like Formspree, or use the email link above.';
  });
}
