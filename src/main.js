/* src/main.js – полная версия -------------------------------------------- */

import { initRouter }                     from '@/router';
import { getLang, setLang, onLangChange } from '@/i18n';
import { logout }                         from '@/store';
import { navigate } from '@/router';
import { showConfirmModal } from '@/components/modal.js';

if (!localStorage.getItem('lang')) setLang('ru');

if (import.meta.env.DEV && !import.meta.env.REAL_API) {
  const { setupMockServer } = await import('/mock/server.js');
  setupMockServer();
}

/* ---------- инициализация ---------- */
renderControlPanel();
initRouter();

/* ---------- панель в правом-верхнем углу ---------- */
function renderControlPanel() {
  const backBtn = document.createElement('button');
  backBtn.id = 'back-btn';
  backBtn.className = 'global-back-btn';
  backBtn.title = 'Назад';
  backBtn.innerHTML = '←';
  document.body.append(backBtn);

  const panel = document.createElement('div');
  panel.className = 'control-panel';
  panel.innerHTML = `
    <button id="home-btn"   title="На главную">🏠</button>
    <button id="theme-btn"  title="Смена темы">🌓</button>
    <button id="lang-btn"   title="Смена языка"></button>
    <button id="logout-btn" title="Выйти">🚪</button>
  `;
  document.body.append(panel);

  function updatePanel(){
    const path = window.location.pathname;
    const isLoginOrDashboard = (path === '/login' || path === '/');
    document.getElementById('back-btn' ).style.display = isLoginOrDashboard ? 'none' : 'block';
    document.getElementById('logout-btn').style.display = path === '/login' ? 'none' : 'inline-block';
  }
  updatePanel();
  window.addEventListener('popstate', updatePanel);
  window.addEventListener('va-update-panel', updatePanel);
  onLangChange(updatePanel);

  /* язык */
  const $lang = document.getElementById('lang-btn');
  const applyLangTxt = () => { $lang.textContent = getLang() === 'ru' ? 'RU' : 'EN'; };
  applyLangTxt();
  $lang.onclick = () => { setLang(getLang() === 'ru' ? 'en' : 'ru'); };
  onLangChange(applyLangTxt);

  /* тема */
  const $theme = document.getElementById('theme-btn');
  if (localStorage.getItem('theme') === 'dark')
    document.documentElement.dataset.theme = 'dark';
  $theme.onclick = () => {
    const html = document.documentElement;
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('theme', next);
  };

  /* выход */
  document.getElementById('logout-btn').onclick = () => {
    showConfirmModal(
      'Выход из аккаунта',
      'Вы уверены, что хотите выйти из аккаунта?',
      () => logout(),
      () => {} // ничего не делаем при отмене
    );
  };

  /* на главную */
  document.getElementById('home-btn').onclick = () => navigate('/');

  /* назад */
  document.getElementById('back-btn').onclick = () => history.back();
}
