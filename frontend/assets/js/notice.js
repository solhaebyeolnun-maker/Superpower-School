import { initCommon } from './ui.js';
import { listNotices } from './mockApi.js';

let all = [];

async function load() {
  initCommon();
  all = await listNotices();
  render(all);
  bind();
}

function bind() {
  const search = document.querySelector('#notice-search');
  const filter = document.querySelector('#notice-filter');
  search.addEventListener('input', ()=>apply());
  filter.addEventListener('change', ()=>apply());
}

function apply() {
  const term = document.querySelector('#notice-search').value.toLowerCase();
  const cat = document.querySelector('#notice-filter').value;
  const items = all.filter(n=>{
    const okCat = !cat || n.category===cat;
    const okTerm = n.title.toLowerCase().includes(term) || n.body?.toLowerCase().includes(term);
    return okCat && okTerm;
  });
  render(items);
}

function render(items) {
  const list = document.querySelector('#notice-table');
  list.innerHTML = items.map(n=>`<tr><td>${n.category}</td><td>${n.title}</td><td>${n.createdAt||''}</td></tr>`).join('');
}

load();
