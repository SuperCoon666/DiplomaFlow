import { request } from '@/api/http.js';
import { navigate } from '@/router';
import { showModal, closeModal } from '@/components/modal.js';

export default async function showStudentCard({ params }){
  const sid  = params.sid;
  const card = await request(`/student/${sid}`);

  const types = [
    { key:'project', label:'Проектная практика' },
    { key:'tech',    label:'Технологическая практика' },
    { key:'pre',     label:'Преддипломная практика' },
  ];

  document.querySelector('#app').innerHTML = /*html*/`
    <div class="container student-card">
      <section class="card identity">
        <div class="avatar"></div>
        <h2>${card.name?.replace(' ', '<br>') || 'Неизвестно'}</h2>
        <p>${card.group}</p>
        <button class="btn-accent" onclick="navigate('/chat?user=${sid}')">Чат</button>
      </section>
      <section class="card info">
        <h3 style="text-align:center;margin-bottom:24px">Тема: ${card.topic}</h3>
        <h3 style="text-align:center;margin-bottom:18px">Трекер</h3>
        ${types.map(t=>`
          <p>${t.label}</p>
          <div class="progress"><div style="width:${card.progress[t.key]||0}%"></div></div>
        `).join('')}
        <button id="worksBtn" class="btn-accent" style="width:100%;margin-top:32px">
          Работы
        </button>
      </section>
    </div>`;

  /* всплывающее окно со списком практик */
  document.getElementById('worksBtn').onclick = () => {
    showModal('Задания', `
      <div class="practice-list-modal">
        ${types.map(t=>{
          const p = card.progress[t.key]||0;
          const color = p===100 ? '#22c55e' : p>0 ? '#facc15' : '#ef4444';
          return `<button data-type="${t.key}">
                    <span>${t.label}</span>
                    <span class="status-dot" style="background:${color}"></span>
                  </button>`;
        }).join('')}
      </div>`, (modalEl)=>{
        modalEl.querySelectorAll('button[data-type]')
          .forEach(b=>b.onclick=()=>{
            navigate('/practice/'+b.dataset.type);
            closeModal();
          });
      });
  };
} 