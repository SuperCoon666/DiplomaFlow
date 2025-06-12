/* src/pages/chat.js – полный файл */
import { navigate } from '@/router';
import { request } from '@/api/http.js';
import { getUser }   from '@/store';

export default async function showChat() {
  const params = new URLSearchParams(location.search);
  const sid    = params.get('user');
  const me     = getUser();

  let peer = { name:'Научный руководитель', email:'ivanova@uni.ru' };
  if (sid && me.role==='TEACHER'){
    peer = await request('/student/'+sid);
  }

  document.querySelector('#app').innerHTML = /*html*/`
    <main class="container">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:var(--gap-s)">
        Чат с&nbsp;${peer.name.replace(' ','&nbsp;')}
      </h2>

      <section class="chat-layout">
        <div class="card profile-pane">
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--gap-s)">
            <div id="peer-avatar" style="width:110px;height:110px;border-radius:50%;border:3px solid #cbd5e1;
                        display:flex;align-items:center;justify-content:center;font-size:3rem;">
              👤
            </div>
            <div style="font-size:1.05rem;line-height:1.4;text-align:center">
              <b>${peer.name.replace(' ','<br>')}</b><br>
              ${peer.email ? `<span style="opacity:.7">${peer.email}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="card dialog-pane">
          <div id="messages" class="messages"></div>
          <form id="chat-form" class="send-box">
            <input id="message" required placeholder="Напишите сообщение…" />
            <button class="btn-accent" style="flex-shrink:0">Отправить</button>
          </form>
        </div>
      </section>
    </main>`;

  if (sid && me.role === 'TEACHER') {
    const avatarEl = document.getElementById('peer-avatar');
    if (avatarEl) {
      avatarEl.style.cursor = 'pointer';
      avatarEl.onclick = () => navigate(`/student/${sid}`);
    }
  }

  const $msgs  = document.getElementById('messages');
  const $form  = document.getElementById('chat-form');
  const $input = document.getElementById('message');

  $form.onsubmit = (e) => {
    e.preventDefault();
    const text = $input.value.trim();
    if (!text) return;
    addMsg('you', text);
    setTimeout(() => addMsg('ru', 'Приняла, спасибо!'), 600);
    $input.value = '';
  };

  function addMsg(side, text) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${side}`;
    bubble.textContent = text;
    $msgs.append(bubble);
    $msgs.scrollTop = $msgs.scrollHeight;
  }
}
