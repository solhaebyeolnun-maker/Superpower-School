import { initCommon } from './ui.js';
import { listCommunity, postCommunity, subscribe } from './mockApi.js';
import { getSession } from './state.js';

const channelSelect = document.querySelector('#channel-select');
const log = document.querySelector('#community-log');
const form = document.querySelector('#community-form');
let current = '자유게시판';

async function load() {
  initCommon();
  await changeChannel(current);
  form.addEventListener('submit', send);
  channelSelect.addEventListener('change', async (e)=>{
    current = e.target.value; await changeChannel(current);
  });
  subscribe('community', payload=>{
    if (payload.channel === current) renderMessages(payload.messages);
  });
}

async function changeChannel(name) {
  const msgs = await listCommunity(name);
  renderMessages(msgs);
}

function renderMessages(msgs) {
  log.innerHTML = '';
  msgs.forEach(m=>{
    const div = document.createElement('div');
    div.className = 'chat-bubble' + (m.user==='나'? ' me':'');
    div.innerHTML = `<div style="font-weight:700;">${m.user} <span class="tag">${m.role}</span></div>${m.text}`;
    log.appendChild(div);
  });
  log.scrollTop = log.scrollHeight;
}

async function send(e) {
  e.preventDefault();
  const s = getSession();
  const text = form.querySelector('input').value;
  if (!text) return;
  const payload = { user: s?.name || '게스트', role: s?.role || 'guest', text };
  await postCommunity(current, payload);
  form.reset();
  changeChannel(current);
}

load();
