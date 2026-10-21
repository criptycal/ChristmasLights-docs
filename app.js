'use strict';

const themeButton = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let chosenTheme = document.documentElement.dataset.theme || null;
function renderTheme() {
  const theme = chosenTheme || (systemTheme.matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  const next = theme === 'dark' ? 'light' : 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${next} theme`);
  themeButton.title = `Switch to ${next} theme`;
  themeButton.querySelector('.theme-label').textContent = `${next === 'light' ? 'Light' : 'Dark'} theme`;
}
themeButton.addEventListener('click', () => {
  chosenTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('christmas-lights-theme', chosenTheme); } catch (_) { /* Keep this session's choice. */ }
  renderTheme();
});
systemTheme.addEventListener('change', () => { if (!chosenTheme) renderTheme(); });
window.addEventListener('storage', event => {
  if (event.key !== 'christmas-lights-theme' && event.key !== null) return;
  chosenTheme = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
  renderTheme();
});
renderTheme();
themeButton.hidden = false;

const search = document.querySelector('#search');
const sections = [...document.querySelectorAll('[data-section]')];
const links = [...document.querySelectorAll('nav a')];
const sidebar = document.querySelector('#sidebar');
const menu = document.querySelector('.menu-button');
const status = document.querySelector('#search-status');
const empty = document.querySelector('#no-results');
const searchText = new Map(sections.map(section => [section, section.textContent.toLocaleLowerCase()]));
function filterSections() {
  const query = search.value.trim().toLocaleLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  let count = 0;
  for (const section of sections) {
    section.hidden = !terms.every(term => searchText.get(section).includes(term));
    if (!section.hidden) count++;
  }
  empty.hidden = count > 0;
  status.textContent = query ? `${count} matching section${count === 1 ? '' : 's'}` : '';
}
function closeMenu() { sidebar.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
search.addEventListener('input', filterSections);
search.addEventListener('keydown', event => { if (event.key === 'Escape') { search.value = ''; filterSections(); } });
document.querySelector('#clear-search').addEventListener('click', () => { search.value = ''; filterSections(); search.focus(); });
menu.addEventListener('click', () => { const open = sidebar.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && sidebar.classList.contains('open')) { closeMenu(); menu.focus(); } });
for (const anchor of document.querySelectorAll('a[href^="#"]')) {
  anchor.addEventListener('click', () => { search.value = ''; filterSections(); closeMenu(); });
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting && !entry.target.hidden);
    if (!visible.length) return;
    const id = visible[0].target.id;
    for (const link of links) {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    }
  }, {rootMargin: '-100px 0px -60% 0px', threshold: 0});
  sections.forEach(section => observer.observe(section));
}

// Load the animation when it is in view, and honor reduced-motion preferences.
for (const demo of document.querySelectorAll('.demo:not(.pattern-demo)')) {
  const demoImage = demo.querySelector('img[data-animation]');
  const demoToggle = demo.querySelector('.demo-toggle');
  if (!demoImage || !demoToggle) continue;
  const poster = demoImage.dataset.poster;
  const motionSource = demo.querySelector('source[media]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let playing = false;
  let userChoice = false;
  function setDemoPlaying(next) {
    playing = next;
    const source = next ? demoImage.dataset.animation : poster;
    if (motionSource) motionSource.srcset = source;
    demoImage.src = source;
    demoToggle.textContent = next ? 'Pause animation' : 'Play animation';
  }
  setDemoPlaying(!reducedMotion.matches && !('IntersectionObserver' in window));
  demoToggle.hidden = false;
  demoToggle.addEventListener('click', () => { userChoice = true; setDemoPlaying(!playing); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) setDemoPlaying(false); });
  if ('IntersectionObserver' in window) {
    const demoObserver = new IntersectionObserver(entries => {
      if (!userChoice) setDemoPlaying(entries[0].isIntersecting && !reducedMotion.matches);
    }, {threshold: 0.2});
    demoObserver.observe(demoImage);
  }
}

// Pattern recordings load only after their category is opened.
const patternItems = [...document.querySelectorAll('.pattern-category')];
for (const item of patternItems) {
  const image = item.querySelector('img[data-animation]');
  const button = item.querySelector('.demo-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = !('IntersectionObserver' in window);
  let intent = 'auto';
  let playing = false;
  function update() {
    const next = item.open && visible && !document.hidden &&
      (intent === 'play' || (intent === 'auto' && !reduced.matches));
    if (next !== playing) {
      image.src = next ? image.dataset.animation : image.dataset.poster;
      playing = next;
    }
    button.textContent = playing ? 'Pause animation' : 'Play animation';
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${item.dataset.pattern} animation`);
  }
  button.hidden = false;
  button.addEventListener('click', () => {
    intent = playing ? 'pause' : 'play';
    update();
  });
  item.addEventListener('toggle', () => {
    if (item.open) {
      for (const other of patternItems) if (other !== item) other.open = false;
    } else {
      intent = 'auto';
    }
    update();
  });
  reduced.addEventListener('change', () => { intent = 'auto'; update(); });
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      update();
    }, { threshold: 0.15 });
    observer.observe(image);
  }
  update();
}
function openLinkedPattern() {
  const item = patternItems.find(candidate => `#${candidate.id}` === location.hash);
  if (item) {
    for (const other of patternItems) other.open = other === item;
    item.scrollIntoView({ block: 'start' });
  }
}
window.addEventListener('hashchange', openLinkedPattern);
openLinkedPattern();
