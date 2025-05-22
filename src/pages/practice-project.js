import { request } from '@/api/http.js';
import { navigate } from '@/router';

export default () => showEditor('project', 'Проектная практика');

function showEditor(type, title) {
  document.querySelector('#app').innerHTML = `
    <main class="container">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:var(--gap-s)">
        ${title}
      </h2>

      <section class="editor-layout">
        <aside class="versions-pane" id="versions"><p style="opacity:.6;text-align:center;margin-top:var(--gap-s)">Нет версий</p></aside>

        <div class="editor-pane">
          <div class="toolbar">
            <button onclick="document.execCommand('bold')"><b>B</b></button>
            <button onclick="document.execCommand('italic')"><i>I</i></button>
            <button onclick="document.execCommand('insertUnorderedList')">• список</button>
            <button onclick="document.execCommand('insertOrderedList')">1. список</button>
          </div>

          <textarea id="editor" placeholder="Начните писать…"></textarea>

          <div class="actions">
            <button class="btn-accent" id="save">Сохранить</button>
            <button class="btn-accent" onclick="navigate('/')">На&nbsp;главную</button>
          </div>
        </div>
      </section>
    </main>`;

  const $v = document.getElementById('versions');
  const $e = document.getElementById('editor');
  let current = null;

  const load = async () => {
    const list = await request(`/practice/${type}/versions`);
    if (!list.length) {
      $v.innerHTML = '<p style="opacity:.6;text-align:center;margin-top:var(--gap-s)">Нет версий</p>';
      return;
    }
    $v.innerHTML = list.map(v =>
      `<button class="version-item ${v.id===current?'active':''}" data-id="${v.id}">${v.date}</button>`).join('');
  };

  $v.addEventListener('click', async (e)=>{
    const btn=e.target.closest('.version-item');if(!btn)return;
    current=+btn.dataset.id;
    const ver=(await request(`/practice/${type}/versions`)).find(v=>v.id===current);
    if(ver)$e.value=ver.content;
    load();
  });

  document.getElementById('save').onclick = async ()=>{
    const content=$e.value.trim();
    if(!content)return alert('Введите текст');
    await request(`/practice/${type}/versions`,{method:'POST',body:{content}});
    current=null;$e.value='';await load();alert('Сохранено!');
  };

  load();
}
