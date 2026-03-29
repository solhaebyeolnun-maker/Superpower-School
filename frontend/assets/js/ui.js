import { restoreTheme, toggleTheme, getSession } from './state.js';

export function initCommon() {
  restoreTheme();
  const themeToggle = document.querySelector('[data-theme-toggle]');
  themeToggle?.addEventListener('click', () => {
    const next = toggleTheme();
    themeToggle.setAttribute('aria-pressed', next==='dark');
  });
  const session = getSession();
  const userSlot = document.querySelector('[data-user-slot]');
  if (session && userSlot) {
    userSlot.textContent = `${session.name} (${session.role})`;
  }
}

export function renderList(el, items, render) {
  if (!el) return;
  el.innerHTML = '';
  items.forEach(item => el.appendChild(render(item)));
}

export function pill(text, tone='default') {
  const span = document.createElement('span');
  span.className = 'chip';
  span.textContent = text;
  if (tone==='warn') span.style.borderColor = 'rgba(255,193,7,0.35)';
  return span;
}

export function modal(id) {
  const node = document.getElementById(id);
  return {
    open() { node?.classList.add('active'); node?.querySelector('input,button,textarea')?.focus(); },
    close() { node?.classList.remove('active'); }
  };
}

export function setTicker(notices) {
  const strip = document.querySelector('.ticker');
  if (!strip) return;
  strip.innerHTML = '';
  notices.forEach(n=>{
    const div = document.createElement('div');
    div.className = 'ticker-item';
    div.innerHTML = `<div class="badge">${n.category}</div><div>${n.title}</div>`;
    strip.appendChild(div);
  });
}

export function renderCalendar(container, events) {
  if (!container) return;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(7, minmax(120px,1fr))';
  grid.style.gap = '0.4rem';
  const headings = ['일','월','화','수','목','금','토'];
  headings.forEach(h=>{
    const hd = document.createElement('div');
    hd.textContent = h;
    hd.style.fontWeight = '700';
    grid.appendChild(hd);
  });
  for (let i=0;i<startDay;i++) grid.appendChild(document.createElement('div'));
  for (let d=1; d<=daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'card';
    cell.style.padding = '0.6rem';
    cell.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;">
      <strong>${d}</strong>
      <span class="tag">${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}</span>
    </div>`;
    const list = document.createElement('div');
    list.style.display = 'flex'; list.style.flexDirection='column'; list.style.gap='0.3rem';
    events.filter(ev=>ev.date.endsWith(`-${String(d).padStart(2,'0')}`)).forEach(ev=>{
      const row = document.createElement('div');
      row.innerHTML = `<span class="badge">${ev.tag}</span> ${ev.title}`;
      list.appendChild(row);
    });
    cell.appendChild(list);
    grid.appendChild(cell);
  }
  container.appendChild(grid);
}
