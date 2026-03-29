import { getSession, setSession, clearSession } from './state.js';
import { loginDemo } from './mockApi.js';

export function handleLogin(form) {
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const id = form.querySelector('[name=id]').value.trim();
    const pw = form.querySelector('[name=password]').value.trim();
    const mode = form.querySelector('[name=mode]').value;
    if (mode === 'demo') {
      const user = loginDemo(id, pw);
      if (user) {
        setSession({ ...user, mode });
        location.href = 'index.html';
      } else {
        alert('계정을 다시 확인하세요.');
      }
    } else {
      fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,pw})})
        .then(r=>r.ok?r.json():Promise.reject())
        .then(user=>{ setSession({ ...user, mode:'server' }); location.href='index.html'; })
        .catch(()=>alert('서버 로그인 실패. 계정 혹은 서버 상태를 확인하세요.'));
    }
  });
}

export function guardAdmin() {
  const s = getSession();
  if (!s || s.role !== 'admin') {
    alert('관리자만 접근 가능합니다.');
    location.href = 'login.html';
  }
}

export function guardLogin() {
  const s = getSession();
  if (!s) {
    alert('로그인이 필요합니다.');
    location.href = 'login.html';
  }
}

export function logout() { clearSession(); location.href='index.html'; }
