import { initRouter } from '@/router';
import { toggleTheme } from '@/utils/theme.js';
import { changeLang } from '@/i18n';
import { setupMockServer } from '@/mock/server.js';

document.addEventListener('DOMContentLoaded', () => {
  setupMockServer();      // ← подключаем моки
  initRouter();

  const panel = document.createElement('div');
  panel.className = 'control-panel';
  panel.innerHTML = `
    <button id="theme" title="Переключить тему">🌗</button>
    <button id="ru">RU</button>
    <button id="en">EN</button>
  `;
  document.body.append(panel);

  panel.querySelector('#theme').onclick = toggleTheme;
  panel.querySelector('#ru').onclick = () => changeLang('ru');
  panel.querySelector('#en').onclick = () => changeLang('en');
});
