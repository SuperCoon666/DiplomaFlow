/* src/pages/dashboard-student.js – полный файл */
import { request } from '@/api/http.js';
import { getUser } from '@/store';
import { navigate }  from '@/router';
import { showModal } from '@/components/modal.js';

/* ---------------- данные-заглушки ---------------- */
const progress = 42;           // %

/* ---------------- страница ---------------- */
export default async function showDashboard() {
  const user = getUser();
  const progress = user?.progress || { project: 0, tech: 0, pre: 0 };
  const deadlines = user?.deadlines || [];

  // Находим ближайший будущий дедлайн
  const now = new Date();
  const upcomingDeadlines = deadlines
    .map(d => ({ ...d, date: new Date(d.date) }))
    .filter(d => d.date >= now)
    .sort((a, b) => a.date - b.date);
  const nearestDeadline = upcomingDeadlines[0];

  document.querySelector('#app').innerHTML = /*html*/`
    <main class="container">
      <section class="dashboard-grid">

        <!-- Трекер -------------------------------------------------------------- -->
        <article class="card vstack" id="tracker-card">
          <h3>Трекер</h3>
          <div class="progress-item">
            <p>Проектная пр.</p>
            <div class="progress"><div style="width:${progress.project}%"></div></div>
          </div>
          <div class="progress-item">
            <p>Технологическая пр.</p>
            <div class="progress"><div style="width:${progress.tech}%"></div></div>
          </div>
          <div class="progress-item">
            <p>Преддипломная пр.</p>
            <div class="progress"><div style="width:${progress.pre}%"></div></div>
          </div>
        </article>

        <!-- Выполнение ---------------------------------------------------------- -->
        <article class="card practice-list">
          <h3>Выполнение</h3>
          <button class="btn-accent" data-path="/practice/project">Проектная&nbsp;практика</button>
          <button class="btn-accent" data-path="/practice/tech">Технологическая&nbsp;практика</button>
          <button class="btn-accent" data-path="/practice/pre">Преддипломная&nbsp;практика</button>
        </article>

        <!-- Уведомления --------------------------------------------------------- -->
        <article class="card">
          <h3>Уведомления</h3>
          <div id="notif" class="notifications-list"></div>
        </article>

        <!-- Чат ----------------------------------------------------------------- -->
        <article class="card" id="chat-card" style="text-align:center">
          <h3>Чат</h3>
          <svg width="48" height="48" fill="currentColor" style="opacity:.6">
            <use href="#icon-user"></use>
          </svg>
          <p style="margin-top:var(--gap-s)">Научный&nbsp;Руководитель</p>
        </article>

        <!-- Сроки --------------------------------------------------------------- -->
        <article class="card deadline-card" id="deadlines-card">
          <h3>Сроки</h3>
          ${nearestDeadline ? `
            <p style="font-weight:600">Ближайший:</p>
            <p style="color:#b91c1c">${nearestDeadline.date.toLocaleDateString()}</p>
            <p style="font-size:0.9rem; opacity:0.8;">${nearestDeadline.title}</p>
          ` : `
            <p>Нет предстоящих сроков</p>
          `}
        </article>

      </section>
    </main>
  `;

  /* ——— подробный прогресс по клику на трекер ——— */
  document.getElementById('tracker-card').onclick = () => {
    const content = `
      <div class="vstack" style="gap: var(--gap-m);">
        <div class="progress-item">
          <p>Проектная практика</p>
          <div class="progress"><div style="width:${progress.project}%"></div></div>
          <p style="text-align: right; opacity: 1; font-weight: 600; font-size: 1.1rem;">${progress.project}%</p>
        </div>
        <div class="progress-item">
          <p>Технологическая практика</p>
          <div class="progress"><div style="width:${progress.tech}%"></div></div>
          <p style="text-align: right; opacity: 1; font-weight: 600; font-size: 1.1rem;">${progress.tech}%</p>
        </div>
        <div class="progress-item">
          <p>Преддипломная практика</p>
          <div class="progress"><div style="width:${progress.pre}%"></div></div>
          <p style="text-align: right; opacity: 1; font-weight: 600; font-size: 1.1rem;">${progress.pre}%</p>
        </div>
      </div>
    `;
    showModal('Подробный прогресс', content);
  };

  /* ——— все сроки по клику на карточку ——— */
  document.getElementById('deadlines-card').onclick = () => {
    const pastDeadlines = deadlines.filter(d => new Date(d.date) < now);
    const futureDeadlines = deadlines.filter(d => new Date(d.date) >= now);

    const formatDeadlines = (arr) => arr.length
      ? arr.map(d => `<div class="deadline-item">
          <span class="deadline-date">${new Date(d.date).toLocaleDateString()}</span>
          <span class="deadline-title">${d.title}</span>
        </div>`).join('')
      : '<div>Нет</div>';

    const content = `
      <div class="deadlines-modal-content">
        <h4>Предстоящие</h4>
        ${formatDeadlines(futureDeadlines)}
        <hr>
        <h4>Прошедшие</h4>
        ${formatDeadlines(pastDeadlines)}
      </div>
    `;
    showModal('Все сроки', content);
  };

  /* ——— навигация к практикам ——— */
  document.querySelectorAll('.practice-list .btn-accent')
          .forEach(btn => btn.onclick = () => navigate(btn.dataset.path));

  /* ——— открытие чата ——— */
  document.getElementById('chat-card').onclick = () => navigate('/chat');

  /* ——— вывод и обработка уведомлений ——— */
  const $list = document.getElementById('notif');
  const uid = getUser()?.id;
  let list = [];
  try { list = await request(`/notifications/${uid}`); }
  catch(e){ console.warn(e.message); }

  $list.innerHTML = list.map(n => `
    <button class="${n.status ? 'btn-grey' : 'btn-accent'}"
            data-id="${n.id}"
            data-title="${n.type}"
            data-msg="${n.message}">
      ${n.message}
    </button>`).join('');

  $list.querySelectorAll('.btn-accent, .btn-grey')
       .forEach(btn => btn.onclick = async () => {
         showModal(btn.dataset.title, btn.dataset.msg);
         await request(`/notifications/${btn.dataset.id}/read`,{method:'PUT'});
         btn.classList.remove('btn-accent');
         btn.classList.add('btn-grey');
       });
}
