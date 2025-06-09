/* src/pages/dashboard-student.js – полный файл */
import { request } from '@/api/http.js';
import { getUser } from '@/store';
import { navigate }  from '@/router';
import { showModal } from '@/components/modal.js';

/* ---------------- данные-заглушки ---------------- */
const progress = 42;           // %

/* ---------------- страница ---------------- */
export default async function showDashboard() {
  document.querySelector('#app').innerHTML = /*html*/`
    <main class="container">
      <section class="dashboard-grid">

        <!-- Трекер -------------------------------------------------------------- -->
        <article class="card">
          <h3>Трекер</h3>
          <p style="margin-bottom:var(--gap-s)">Проектная&nbsp;пр.</p>
          <div class="progress"><div style="width:${progress}%"></div></div>
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
        <article class="card deadline-card">
          <h3>Сроки</h3>
          <p style="font-weight:600">Ближайший:</p>
          <p style="color:#b91c1c">22.03.2025</p>
        </article>

      </section>
    </main>
  `;

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
