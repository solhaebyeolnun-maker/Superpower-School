import { handleLogin } from './auth.js';
import { initCommon } from './ui.js';

document.addEventListener('DOMContentLoaded', ()=>{
  initCommon();
  const form = document.querySelector('#login-form');
  handleLogin(form);
});
