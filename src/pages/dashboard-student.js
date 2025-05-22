// макет приветственной страницы студента
export default function showStudent() {
  document.querySelector('#app').innerHTML = `
    <main class="container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--space-l);margin-top:var(--space-l)">

      <!-- Трекер -->
      <section class="card" style="text-align:center">
        <h3>Трекер</h3>
        <p>Проектная пр.</p>
        <div style="background:#eee;border-radius:4px;overflow:hidden;height:20px">
          <div style="width:45%;background:var(--accent);height:100%"></div>
        </div>
      </section>

      <!-- Выполнение -->
      <section class="card">
        <h3 style="text-align:center">Выполнение</h3>
        <button class="accent" style="width:100%;margin-bottom:8px">Проектная практика</button>
        <button class="accent" style="width:100%;margin-bottom:8px">Технологическая практика</button>
        <button class="accent" style="width:100%">Преддипломная практика</button>
      </section>

      <!-- Уведомления -->
      <section class="card" style="text-align:center">
        <h3>Уведомления</h3>
        <button class="accent" style="width:100%">Приближа...</button>
      </section>

      <!-- Чат -->
      <section class="card" style="text-align:center">
        <h3>Чат</h3>
        <p>👤  Научный Руководитель</p>
      </section>

      <!-- Сроки -->
      <section class="card">
        <h3>Сроки</h3>
        <p><strong>Ближайший:</strong><br><span style="color:#c0392b">22.03.2025</span></p>
      </section>
    </main>
  `;
}
