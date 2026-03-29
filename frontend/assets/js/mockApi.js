// Mock data and optional server sync
import { demoUsers, roles } from './state.js';
import { seedNotices, seedEvents, seedMeals, seedCommunity, seedFacilities } from './seed.js';

let mode = 'demo';
export function setMode(nextMode) { mode = nextMode; }
export function getMode() { return mode; }

const storage = {
  notices: 'sta_notices',
  meals: 'sta_meals',
  events: 'sta_events',
  community: 'sta_community',
  facilities: 'sta_facilities'
};

function loadOrSeed(key, seed) {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

export function listNotices() {
  if (mode === 'server') return fetch('/api/notices').then(r=>r.json());
  return Promise.resolve(loadOrSeed(storage.notices, seedNotices()));
}

export function createNotice(entry) {
  if (mode === 'server') {
    return fetch('/api/notices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(entry)}).then(r=>r.json());
  }
  const data = loadOrSeed(storage.notices, seedNotices());
  data.unshift({ ...entry, id: crypto.randomUUID(), createdAt:new Date().toISOString() });
  localStorage.setItem(storage.notices, JSON.stringify(data));
  return Promise.resolve(entry);
}

export function listEvents() {
  if (mode === 'server') return fetch('/api/events').then(r=>r.json());
  return Promise.resolve(loadOrSeed(storage.events, seedEvents()));
}

export function listMeals(dateKey) {
  if (mode === 'server') return fetch(`/api/meals?date=${dateKey}`).then(r=>r.json());
  const base = loadOrSeed(storage.meals, seedMeals());
  return Promise.resolve(base[dateKey] || base.default);
}

export function listCommunity(channel) {
  if (mode === 'server') return fetch(`/api/community?channel=${channel}`).then(r=>r.json());
  const all = loadOrSeed(storage.community, seedCommunity());
  return Promise.resolve(all[channel] || []);
}

export function postCommunity(channel, message) {
  if (mode === 'server') {
    return fetch(`/api/community/${channel}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(message)}).then(r=>r.json());
  }
  const all = loadOrSeed(storage.community, seedCommunity());
  all[channel] = all[channel] || [];
  all[channel].push({ ...message, id: crypto.randomUUID(), at:new Date().toISOString() });
  localStorage.setItem(storage.community, JSON.stringify(all));
  broadcast(channel, all[channel]);
  return Promise.resolve(message);
}

export function facilitiesSnapshot() {
  if (mode === 'server') return fetch('/api/facilities').then(r=>r.json());
  const base = loadOrSeed(storage.facilities, seedFacilities());
  const jitter = base.map(f=>({
    ...f,
    availability: Math.max(0, Math.min(100, f.availability + (Math.random()*10-5)))
  }));
  return Promise.resolve(jitter);
}

// BroadcastChannel sync for demo realtime
const channels = {};
function broadcast(name, payload) {
  if (!channels[name]) channels[name] = new BroadcastChannel(`sta_${name}`);
  channels[name].postMessage(payload);
}
export function subscribe(channel, handler) {
  if (!channels[channel]) channels[channel] = new BroadcastChannel(`sta_${channel}`);
  channels[channel].onmessage = (e)=>handler(e.data);
}

export function loginDemo(id, password) {
  const user = demoUsers.find(u=>u.id===id && u.password===password);
  if (!user) return null;
  return { id:user.id, name:user.name, role:user.role };
}

export const AI_ENDPOINT = 'https://api.aicloud.lol/v1/chat/completions';
export function aiSuggest(prompt, apiKey) {
  if (!apiKey) return Promise.reject(new Error('API key required for external AI endpoint'));
  return fetch(AI_ENDPOINT, {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
    body: JSON.stringify({
      model:'gpt-3.5-turbo',
      messages:[{role:'system',content:'서울시 특이능력 영재학교 세계관에 맞춰 간결히 답변'}, {role:'user',content:prompt}],
      max_tokens: 200
    })
  }).then(r=>r.json());
}
