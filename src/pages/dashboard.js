import { t } from '@/i18n';

export default async function showDashboard() {
  document.querySelector('#app').innerHTML = `
    <main class="container">
      <h1>${await t('dashboard.hello') ?? 'Здравствуйте!'}</h1>
      <section class="grid" id="cards"></section>
    </main>
  `;

  // временные карточки-заглушки
  const mock = ['Первая практика', 'Вторая практика', 'Третья практика'];
  const cards = document.getElementById('cards');

  mock.forEach((title) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<h3>${title}</h3><p>Краткое описание работы.</p>`;
    cards.append(el);
  });
}
