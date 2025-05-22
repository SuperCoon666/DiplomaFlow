/* src/pages/chat.js – полный файл */
import { navigate } from '@/router';

export default function showChat() {
  document.querySelector('#app').innerHTML = /*html*/`
    <main class="container">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:var(--gap-s)">
        Чат с&nbsp;научным&nbsp;руководителем
      </h2>

      <section class="chat-layout">

        <!-- левая визитка преподавателя -->
        <div class="card profile-pane">
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--gap-s)">
            <div style="width:110px;height:110px;border-radius:50%;border:3px solid #cbd5e1;
                        display:flex;align-items:center;justify-content:center;font-size:3rem;">
              👤
            </div>
            <div style="font-size:1.05rem;line-height:1.4;text-align:center">
              <b>Иванова<br>Мария&nbsp;Петровна</b><br>
              <span style="opacity:.7">ivanova@uni.ru</span>
            </div>
          </div>
        </div>

        <!-- правая колонка: сообщения + ввод -->
        <div class="card dialog-pane">
          <div id="messages" class="messages"></div>

          <form id="chat-form" class="send-box">
            <input id="message" required placeholder="Напишите сообщение…" />
            <button class="btn-accent" style="flex-shrink:0">Отправить</button>
          </form>
        </div>
      </section>

      <div style="text-align:center;margin-top:var(--gap-l)">
        <a data-link href="/" class="btn-accent" style="padding-inline:40px">Назад</a>
      </div>
    </main>`;

  /* --- простая имитация чата (локально) --- */
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
