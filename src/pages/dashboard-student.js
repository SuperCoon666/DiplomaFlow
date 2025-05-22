export default function showStudent(){
  document.querySelector('#app').innerHTML=`
    <main class="container">
      <section class="dashboard-grid">

        <!-- Трекер -->
        <a class="card card-link" data-link href="/tracker">
          <h3>Трекер</h3>
          <p style="text-align:center;margin-bottom:var(--gap-s)">Проектная&nbsp;пр.</p>
          <div class="progress"><div style="width:45%"></div></div>
        </a>

        <!-- Выполнение -->
        <div class="card">
          <h3>Выполнение</h3>
          <div class="vstack">
            <a data-link href="/practice/project" class="btn-accent">Проектная практика</a>
            <a data-link href="/practice/tech"    class="btn-accent">Технологическая практика</a>
            <a data-link href="/practice/pre"     class="btn-accent">Преддипломная практика</a>
          </div>
        </div>

        <!-- Уведомления -->
        <div class="card">
          <h3>Уведомления</h3>
          <div class="notifications-list">
            <button class="btn-accent" style="width:auto">Приближается сдача</button>
            <button class="btn-accent" style="width:auto">Новый комментарий&nbsp;от&nbsp;руководителя</button>
            <button class="btn-accent" style="width:auto">Открыта&nbsp;оценка за&nbsp;практику</button>
          </div>
        </div>

        <!-- Чат -->
        <a class="card card-link" data-link href="/chat" style="text-align:center">
          <h3>Чат</h3>
          <p style="display:flex;justify-content:center;align-items:center;gap:8px;font-size:1.1rem;margin-top:var(--gap-s)">
            <span style="font-size:1.5rem">👤</span> Научный&nbsp;Руководитель
          </p>
        </a>

        <!-- Сроки -->
        <a class="card card-link" data-link href="/deadlines">
          <h3>Сроки</h3>
          <p><strong>Ближайший:</strong><br><span style="color:#e11d48">22.03.2025</span></p>
        </a>

      </section>
    </main>`;
}
