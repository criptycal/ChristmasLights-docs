'use strict';
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
