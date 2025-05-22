/* src/pages/practice-project.js — полный файл */
import { request }  from '@/api/http.js';
import { navigate } from '@/router';

/* ---------------- страница ---------------- */
export default function () {
  showEditor('project', 'Проектная практика');
}

/* ------------------------------------------------------------- */
function showEditor(type, title) {
  document.querySelector('#app').innerHTML = /*html*/`
    <main class="container">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:var(--gap-s)">
        ${title}
      </h2>

      <section class="editor-layout">
        <aside class="versions-pane" id="versions">
          <p style="opacity:.6;text-align:center;margin-top:var(--gap-s)">
            Нет версий
          </p>
        </aside>

        <div class="editor-pane">
          <div class="toolbar">
            <button onclick="document.execCommand('bold')"><b>Ж</b></button>
            <button onclick="document.execCommand('italic')"><i>К</i></button>
            <button onclick="document.execCommand('insertUnorderedList')">• список</button>
            <button onclick="document.execCommand('insertOrderedList')">1. список</button>
          </div>

          <textarea id="editor" placeholder="Начните писать…"></textarea>

          <div class="actions">
            <button class="btn-accent" id="save-btn">Сохранить</button>
            <button class="btn-accent" onclick="navigate('/')">На проверку</button>
          </div>
        </div>
      </section>
    </main>
  `;

  const $versions = document.getElementById('versions');
  const $editor   = document.getElementById('editor');

  /* ---------- получить список версий ---------- */
  loadList();

  async function loadList() {
    try {
      const list = await request(`/practice/${type}/versions`);
      renderList(list);
    } catch (e) { console.warn(e.message); }
  }

  /* ---------- рендер списка ---------- */
  function renderList(arr) {
    if (!arr.length) return;
    $versions.innerHTML = '';
    arr.forEach(v => {
      const btn = document.createElement('div');
      btn.className   = 'version-item';
      btn.textContent = new Date(v.createdAt).toLocaleString();
      btn.onclick     = () => loadVersion(v.id, btn);
      $versions.append(btn);
    });
    /* автоматически открываем самую свежую */
    loadVersion(arr[0].id, $versions.firstChild);
  }

  /* ---------- загрузить выбранную версию ---------- */
  async function loadVersion(id, el) {
    document.querySelectorAll('.version-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    try {
      const v = await request(`/practice/${type}/version/${id}`);
      $editor.value = v.content;
    } catch (e) { alert(e.message); }
  }

  /* ---------- сохранить новую версию ---------- */
  document.getElementById('save-btn').onclick = async () => {
    try {
      await request(`/practice/${type}/save`, {
        method:'POST',
        body:{ content: $editor.value }
      });
      await loadList();                               // перерисовать список
      alert('Сохранено!');
    } catch (e) { alert(e.message); }
  };
}
