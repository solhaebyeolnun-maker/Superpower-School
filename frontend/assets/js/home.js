import { initCommon, setTicker, renderCalendar } from './ui.js';
import { listNotices, listEvents, listMeals, facilitiesSnapshot } from './mockApi.js';
import { simulateChat } from './chatSim.js';
import { getSession } from './state.js';

const channels = ['자유게시판','기숙사 라운지','훈련동'];

async function load() {
  initCommon();
  const [notices, events, facilities] = await Promise.all([
    listNotices(), listEvents(), facilitiesSnapshot()
  ]);
  setTicker(notices);
  renderCalendar(document.querySelector('#calendar'), events);
  renderFacilities(facilities);
  renderNotices(notices);
  renderMeals();
  bindChat();
}

function renderFacilities(items) {
  const wrap = document.querySelector('#facilities');
  if (!wrap) return;
  wrap.innerHTML = '';
  items.forEach(f=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<div class="card-title">${f.name}</div>
    <div class="muted">상태: ${f.status}</div>
    <div style="margin-top:0.5rem;">가동률 <strong>${Math.round(f.availability)}%</strong></div>
    <div style="height:6px;border-radius:8px;background:rgba(255,255,255,0.08);overflow:hidden;">
      <div style="width:${f.availability}%;height:100%;background:linear-gradient(90deg,#48d2e9,#7af2c7);"></div>
    </div>`;
    wrap.appendChild(div);
  });
}

function renderNotices(items) {
  const list = document.querySelector('#notice-list');
  if (!list) return;
  list.innerHTML = '';
  items.slice(0,5).forEach(n=>{
    const li = document.createElement('div');
    li.className = 'card';
    li.innerHTML = `<div class="badge">${n.category}</div>
    <div style="font-weight:700;font-size:1.05rem;">${n.title}</div>
    <div class="muted">${n.createdAt}</div>`;
    list.appendChild(li);
  });
}

async function renderMeals() {
  const dateKey = new Date().toISOString().slice(0,10);
  const meals = await listMeals(dateKey);
  const wrap = document.querySelector('#meals');
  wrap.innerHTML = '';
  meals.forEach(m=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<div class="card-title">${m.item}</div><div class="muted">${m.kcal} kcal · 원산지 ${m.origin}</div>`;
    wrap.appendChild(div);
  });
}

function bindChat() {
  const form = document.querySelector('#ai-chat');
  const log = document.querySelector('#ai-log');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const input = form.querySelector('input').value;
    if (!input) return;
    appendBubble(log, input, true);
    const persona = form.querySelector('select').value;
    const reply = simulateChat(input, persona);
    setTimeout(()=>appendBubble(log, reply, false), 250);
    form.reset();
  });
}

function appendBubble(container, text, me=false) {
  const div = document.createElement('div');
  div.className = 'chat-bubble'+(me?' me':'');
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

load();
