import { initRouter, navigate } from '@/router';
import { getLang, setLang, logout }        from '@/store';

/* ---------- инициализация ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderControlPanel();
  initRouter();
});

/* ---------- панель в правом-верхнем углу ---------- */
function renderControlPanel() {
  const panel = document.createElement('div');
  panel.className = 'control-panel';
  panel.innerHTML = `
    <button id="theme-btn" title="Смена темы">🌓</button>
    <button id="lang-btn"  title="Смена языка"></button>
    <button id="logout-btn" title="Выйти">🚪</button>
  `;
  document.body.append(panel);

  /* язык */
  const $lang = document.getElementById('lang-btn');
  const applyLangTxt = () => { $lang.textContent = getLang() === 'ru' ? 'RU' : 'EN'; };
  applyLangTxt();
  $lang.onclick = () => { setLang(getLang() === 'ru' ? 'en' : 'ru'); applyLangTxt(); };

  /* тема */
  const $theme = document.getElementById('theme-btn');
  if (localStorage.getItem('theme') === 'dark') document.documentElement.dataset.theme = 'dark';
  $theme.onclick = () => {
    const html = document.documentElement;
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('theme', next);
  };

  /* выход */
  document.getElementById('logout-btn').onclick = () => logout();
}
