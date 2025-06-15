/* Страница «Дашборд преподавателя» — полный файл */

import { request } from '@/api/http.js';
import { getUser } from '@/store';
import { navigate } from '@/router';
import { showModal } from '@/components/modal.js';

export default async function showDashboardTeacher() {
  const { id } = getUser();

  // данные
  const students = await request(`/teacher/${id}/students`);
  const notes    = await request(`/notifications/${id}`);
  const reviews  = await request(`/teacher/${id}/reviews`);

  // разметка
  document.querySelector('#app').innerHTML = /*html*/`
    <div class="container">
      <div class="teacher-dashboard-content">
        <section class="teacher-grid">
          <article class="card students-card">
            <h3>Студенты</h3>
            <div class="teacher-stu-list">
              ${students.map(s => `
                <button class="stu-row" data-id="${s.id}">
                  <span>${s.name}</span><span>${s.group}</span>
                </button>`).join('')}
            </div>
          </article>

          <article class="card notes-card">
            <h3>Уведомления</h3>
            <div class="notifications-list">
              ${notes.map(n => `
                <button class="${n.status ? 'btn-grey' : 'btn-accent'}"
                        data-id="${n.id}">
                  ${n.message}
                </button>`).join('')}
            </div>
          </article>
        </section>
        <article class="card review-card">
          <h3>Работы на проверку</h3>
          <div class="review-list">
            <div class="review-header">
              <div>ФИО</div>
              <div>Группа</div>
              <div>Практика</div>
            </div>
            ${reviews.map(r => `
              <button class="review-row" data-type="${r.type}">
                <div>${r.name}</div>
                <div>${r.group}</div>
                <div>${r.practice}</div>
              </button>`).join('')}
          </div>
        </article>
      </div>
    </div>`;

  // обработка клика по уведомлению
  document.querySelectorAll('.notifications-list button')
    .forEach(btn => btn.onclick = async () => {
      const note = notes.find(n => n.id == btn.dataset.id);
      if (note) {
        showModal(note.type || 'Уведомление', note.message);
        await request(`/notifications/${btn.dataset.id}/read`, { method:'PUT' });
        btn.classList.remove('btn-accent'); btn.classList.add('btn-grey');
      }
    });

  document.querySelectorAll('.review-row')
    .forEach(btn => btn.onclick = () =>
      navigate(`/practice/${btn.dataset.type}`));

  document.querySelectorAll('.stu-row')
    .forEach(btn => btn.onclick = () =>
      navigate(`/student/${btn.dataset.id}`));
}
