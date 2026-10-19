// ===== SITE SETTINGS =====
// Change this demo password before testing. This client-side login is NOT secure for a public site.
const DEMO_ADMIN_PASSWORD = 'UT-Admin-2026!';
// Add your real social profile URLs here before publishing.
const SOCIAL_URLS = {
  youtube: '',
  instagram: '',
  facebook: ''
};

const roles = ['GAME DEVELOPMENT', 'WEBSITE DEVELOPMENT', 'VIDEO EDITING', 'GRAPHIC DESIGNING', 'SOFTWARE ENGINEERING'];
let roleIndex = 0;
const roleNode = document.getElementById('changingRole');
setInterval(() => {
  roleNode.classList.add('role-out');
  window.setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleNode.textContent = roles[roleIndex];
    roleNode.classList.remove('role-out');
  }, 220);
}, 2000);

document.getElementById('year').textContent = new Date().getFullYear();
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const opened = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
}));
const navLinks = [...document.querySelectorAll('.nav-link')];
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

const adminModal = document.getElementById('adminModal');
const adminForm = document.getElementById('adminForm');
const adminPassword = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');
const editorBar = document.getElementById('editorBar');
const toast = document.getElementById('toast');
let editorEnabled = false;
let toastTimer;
function showToast(message) {
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
function openAdmin() { adminModal.classList.add('show'); adminModal.setAttribute('aria-hidden', 'false'); adminPassword.focus(); }
function closeAdmin() { adminModal.classList.remove('show'); adminModal.setAttribute('aria-hidden', 'true'); }
document.getElementById('adminOpen').addEventListener('click', openAdmin);
document.getElementById('adminClose').addEventListener('click', closeAdmin);
adminModal.addEventListener('click', event => { if (event.target === adminModal) closeAdmin(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAdmin(); });
adminForm.addEventListener('submit', event => {
  event.preventDefault();
  if (adminPassword.value !== DEMO_ADMIN_PASSWORD) { loginError.textContent = 'Incorrect password. Please try again.'; return; }
  loginError.textContent = ''; adminPassword.value = ''; closeAdmin(); enableEditor();
});
const EDITS_STORAGE_KEY = 'ultimateTechnologiesEditableText_v1';
function restoreSavedEdits() {
  try {
    const saved = JSON.parse(localStorage.getItem(EDITS_STORAGE_KEY) || '[]');
    document.querySelectorAll('[data-editable]').forEach((el, index) => {
      if (typeof saved[index] === 'string') el.textContent = saved[index];
    });
  } catch (error) { console.warn('Could not restore saved website edits.', error); }
}
restoreSavedEdits();
function enableEditor() {
  editorEnabled = true; document.body.classList.add('editing'); editorBar.classList.add('show');
  document.querySelectorAll('[data-editable]').forEach(el => { el.contentEditable = 'true'; el.spellcheck = true; });
  showToast('Editor enabled. Click any outlined text to edit it.');
}
function disableEditor() {
  editorEnabled = false; document.body.classList.remove('editing'); editorBar.classList.remove('show');
  document.querySelectorAll('[data-editable]').forEach(el => { el.contentEditable = 'false'; });
  showToast('Editor closed.');
}
document.getElementById('exitEditor').addEventListener('click', disableEditor);
document.getElementById('saveEdits').addEventListener('click', () => {
  if (!editorEnabled) return;
  try {
    const values = [...document.querySelectorAll('[data-editable]')].map(el => el.textContent.trim());
    localStorage.setItem(EDITS_STORAGE_KEY, JSON.stringify(values));
    showToast('Changes saved! They will appear when you reopen this website in this browser.');
  } catch (error) {
    showToast('Could not save changes. Check your browser storage settings.');
  }
});

// Social cards use configured URLs when supplied; otherwise they remain on this page.
document.querySelectorAll('[data-social]').forEach(link => {
  const url = SOCIAL_URLS[link.dataset.social];
  if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  else link.addEventListener('click', event => { event.preventDefault(); showToast('Add your ' + link.dataset.social + ' profile URL in script.js.'); });
});

// Demo contact form: opens the visitor's email app with a prepared message.
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = encodeURIComponent('Message for Ultimate Technologies');
  const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`);
  // Replace this address with the official team email before publishing.
  const destination = 'YOUR-EMAIL@example.com';
  if (destination === 'YOUR-EMAIL@example.com') {
    document.getElementById('formNote').textContent = 'Your message is ready, but the team email has not been configured yet. Update the destination in script.js before publishing.';
    showToast('Contact form needs your official email address.');
    return;
  }
  window.location.href = `mailto:${destination}?subject=${subject}&body=${body}`;
});

// Bright / dark appearance toggle
const themeToggle = document.getElementById('themeToggle');
function setBrightMode(enabled) {
  document.body.classList.toggle('bright-mode', enabled);
  if (themeToggle) {
    themeToggle.textContent = enabled ? '☾ DARK MODE' : '☀ BRIGHT MODE';
    themeToggle.setAttribute('aria-label', enabled ? 'Switch to dark mode' : 'Switch to bright mode');
    themeToggle.title = enabled ? 'Switch to dark mode' : 'Switch to bright mode';
  }
}
if (themeToggle) {
  try { setBrightMode(localStorage.getItem('ultimateTechnologiesBrightMode') === 'true'); } catch (error) {}
  themeToggle.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('bright-mode');
    setBrightMode(enabled);
    try { localStorage.setItem('ultimateTechnologiesBrightMode', String(enabled)); } catch (error) {}
  });
}
