import { request } from '@/api/http.js';
import { getUser } from '@/store';

export default async function showNotifications() {
  document.querySelector('#app').innerHTML = `
    <main class="container">
      <h1>Уведомления</h1>
      <table class="notif-table" style="width:100%;margin-top:2rem">
        <thead>
          <tr><th>Дата</th><th>Сообщение</th><th>Статус</th></tr>
        </thead>
        <tbody id="notif-tbody"></tbody>
      </table>
    </main>
  `;
  const uid = getUser()?.id;
  let list = [];
  try { list = await request(`/notifications/${uid}`); }
  catch(e){ console.warn(e.message); }
  const $tbody = document.getElementById('notif-tbody');
  $tbody.innerHTML = list.map(n => `
    <tr>
      <td>${new Date(n.createdAt).toLocaleString()}</td>
      <td>${n.message}</td>
      <td style="text-align:center">${n.status ? '✓' : ''}</td>
    </tr>
  `).join('');
}
