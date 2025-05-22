/* Страница «Дашборд администратора» — полный файл */

import { navigate } from '@/router';

export default function showDashboardAdmin() {
  document.querySelector('#app').innerHTML = /*html*/ `
    <section class="grid">
      <article class="card">
        <h3>Управление практиками</h3>

        <button class="btn-accent"
                id="proj-btn">Проектная практика</button>

        <button class="btn-accent"
                id="tech-btn">Технологическая практика</button>

        <button class="btn-accent"
                id="pre-btn">Преддипломная практика</button>
      </article>
    </section>
  `;

  document.getElementById('proj-btn').onclick = () => navigate('/practice/project');
  document.getElementById('tech-btn').onclick = () => navigate('/practice/tech');
  document.getElementById('pre-btn').onclick  = () => navigate('/practice/pre');
}
