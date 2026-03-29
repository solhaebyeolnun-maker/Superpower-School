import { guardAdmin } from './auth.js';
import { initCommon } from './ui.js';
import { listNotices, createNotice } from './mockApi.js';

async function load() {
  guardAdmin();
  initCommon();
  await refresh();
  const form = document.querySelector('#notice-form');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const title = form.querySelector('[name=title]').value;
    const category = form.querySelector('[name=category]').value;
    const body = form.querySelector('[name=body]').value;
    await createNotice({ title, category, body, author:'dev' });
    form.reset();
    refresh();
  });
}

async function refresh() {
  const list = await listNotices();
  const table = document.querySelector('#admin-notices');
  table.innerHTML = list.map(n=>`<tr><td>${n.title}</td><td>${n.category}</td><td>${n.createdAt||'-'}</td></tr>`).join('');
}

load();
