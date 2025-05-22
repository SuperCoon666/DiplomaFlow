export default function showStudent() {
  document.querySelector('#app').innerHTML = `
    <main class="container">
      <section class="dashboard-grid">

        <!-- Трекер -->
        <a class="card card-link" data-link href="/tracker">
          <h3>Трекер</h3>
          <p style="text-align:center;margin-bottom:var(--gap-s)">Проектная пр.</p>
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
        <a class="card card-link" data-link href="/notifications" style="text-align:center">
          <h3>Уведомления</h3>
          <button class="btn-accent" style="width:auto;padding-inline:24px">Приближа...</button>
        </a>

        <!-- Чат -->
        <a class="card card-link" data-link href="/chat" style="text-align:center">
          <h3>Чат</h3>
          <p style="font-size:1.1rem;display:flex;justify-content:center;align-items:center;gap:6px">
            <span style="font-size:1.4rem">👤</span> Научный&nbsp;Руководитель
          </p>
        </a>

        <!-- Сроки -->
        <a class="card card-link" data-link href="/deadlines">
          <h3>Сроки</h3>
          <p><strong>Ближайший:</strong><br><span style="color:#e11d48">22.03.2025</span></p>
        </a>

      </section>
    </main>
  `;
}
