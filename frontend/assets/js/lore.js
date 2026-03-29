import { initCommon } from './ui.js';
import { unlockLore, isLoreUnlocked } from './state.js';
import loreContent from '../data/lore.txt' assert { type: 'text' };

document.addEventListener('DOMContentLoaded', ()=>{
  initCommon();
  const gate = document.querySelector('#lore-gate');
  const body = document.querySelector('#lore-body');
  if (isLoreUnlocked()) {
    gate.style.display='none';
    body.innerText = loreContent;
  }
  document.querySelector('#lore-submit').addEventListener('click',()=>{
    const code = document.querySelector('#lore-pass').value;
    if (code==='1234') {
      unlockLore(); gate.style.display='none'; body.innerText = loreContent;
    } else { alert('비밀번호를 다시 확인하세요.'); }
  });
});
