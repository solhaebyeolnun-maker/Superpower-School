// Global state and helpers for mock + server mode toggles
export const STORAGE_KEYS = {
  session: 'sta_session_v1',
  theme: 'sta_theme',
  loreUnlock: 'sta_lore_unlocked'
};

export const roles = {
  admin: 'admin',
  npc: 'npc',
  guest: 'guest'
};

export const demoUsers = [
  { id: 'dev', name: 'Developer', role: roles.admin, password: 'dev1234' },
  { id: 'iris', name: '아이리스', role: roles.npc, password: 'iris1234' },
  { id: 'leon', name: '레온', role: roles.npc, password: 'leon1234' },
  { id: 'mirena', name: '미레나', role: roles.npc, password: 'mirena1234' },
  { id: 'kyle', name: '카일', role: roles.npc, password: 'kyle1234' },
  { id: 'harin', name: '하린', role: roles.npc, password: 'harin1234' },
  { id: 'luka', name: '루카', role: roles.npc, password: 'luka1234' }
];

type Session = {
  id: string;
  name: string;
  role: string;
  mode: 'demo' | 'server';
};

export function getSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEYS.session);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(session) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function toggleTheme() {
  const current = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem(STORAGE_KEYS.theme, next);
  document.body.classList.toggle('dark', next === 'dark');
  return next;
}

export function restoreTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === 'dark') document.body.classList.add('dark');
}

export function unlockLore() { localStorage.setItem(STORAGE_KEYS.loreUnlock, 'true'); }
export function isLoreUnlocked() { return localStorage.getItem(STORAGE_KEYS.loreUnlock) === 'true'; }
