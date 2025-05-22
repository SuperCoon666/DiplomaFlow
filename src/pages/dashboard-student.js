import { navigate } from '@/router';

export default function showDashboard() {
  const $app = document.querySelector('#app');

  /* --- данные-заглушки --- */
  const notifications = [
    { id:1, title:'Приближается сдача', body:'Не забудьте сдать отчёт до 22.03.2025' },
    { id:2, title:'Новый комментарий',   body:'Руководитель оставил комментарий в разделе 2.1' },
    { id:3, title:'Открыта оценка',      body:'Вы можете увидеть текущую оценку за практику' }
  ];

  /* --- разметка --- */
  $app.innerHTML = `
    <main class="container">

      <div class="dashboard-grid">

        <!-- Трекер -->
        <div class="card">
          <h3>Трекер</h3>
          <p style="text-align:center;margin-bottom:var(--gap-s)">Проектная пр.</p>
          <div class="progress"><div style="width:45%"></div></div>
        </div>

        <!-- Выполнение -->
        <div class="card">
          <h3>Выполнение</h3>
          <button class="btn-accent vstack" data-link href="/practice/project">Проектная практика</button>
          <button class="btn-accent vstack" data-link href="/practice/tech">Технологическая практика</button>
          <button class="btn-accent vstack" data-link href="/practice/pre">Преддипломная практика</button>
        </div>

        <!-- Уведомления -->
        <div class="card">
          <h3>Уведомления</h3>
          <div class="notifications-list" id="notif"></div>
        </div>

        <!-- Чат -->
        <div class="card">
          <h3>Чат</h3>
          <a class="vstack" data-link href="/chat" style="display:flex;align-items:center;gap:10px;margin-top:var(--gap-s)">
            <span style="font-size:1.7rem">👤</span> Научный&nbsp;Руководитель
          </a>
        </div>

        <!-- Сроки -->
        <div class="card deadline-card">
          <h3>Сроки</h3>
          <p><b>Ближайший:</b></p>
          <p style="color:#b91c1c;font-weight:500">22.03.2025</p>
        </div>

      </div>
    </main>`;

  /* --- вывод уведомлений --- */
  const $list = document.getElementById('notif');
  $list.innerHTML = notifications
    .map(n => `<button class="btn-accent" style="font-weight:500" data-id="${n.id}">${n.title}</button>`)
    .join('');

  /* --- modal helpers --- */
  function openModal(title, body){
    const $overlay = document.createElement('div');
    $overlay.className = 'modal-overlay';
    $overlay.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        <p>${body}</p>
        <button class="btn-accent" id="ok">OK</button>
      </div>`;
    document.body.append($overlay);
    $overlay.querySelector('#ok').onclick = () => $overlay.remove();
    $overlay.onclick = (e) => { if(e.target===$overlay) $overlay.remove(); };
  }

  /* --- click on notification --- */
  $list.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-id]');
    if(!btn) return;
    const note = notifications.find(n=>n.id==btn.dataset.id);
    if(note) openModal(note.title, note.body);
  });
}
