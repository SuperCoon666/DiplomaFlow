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
        <div class="side-pane">
          <aside class="versions-pane" id="versions">
            <p style="opacity:.6;text-align:center;margin-top:var(--gap-s)">
              Нет версий
            </p>
          </aside>
          <nav class="toc-pane" id="toc"></nav>
        </div>
        <div class="editor-pane">
          <textarea id="editor"></textarea>

          <div class="actions">
            <button class="btn-accent" id="save-btn">Сохранить</button>
            <button class="btn-accent" onclick="navigate('/')">На проверку</button>
          </div>
        </div>
      </section>
    </main>
  `;

  const $versions = document.getElementById('versions');

  // Инициализация TinyMCE
  if (window.tinymce) {
    if (window.tinymce.get('editor')) {
      window.tinymce.get('editor').remove();
    }
    window.tinymce.init({
      selector: '#editor',
      language: 'ru',
      height: 500,
      menubar: true,
      plugins: [
        'lists', 'link', 'code', 'fullscreen', 'table', 'wordcount'
      ],
      toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | code fullscreen | removeformat | help',
      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
      setup: function(editor) {
        editor.on('init change SetContent', function() {
          buildToc(editor);
        });
        editor.on('init', function() {
          editorReady = true;
          if (pendingLoadId) {
            const arr = Array.from($versions.children);
            const idx = arr.findIndex(el => el.dataset.id == pendingLoadId);
            if (idx >= 0) loadVersion(pendingLoadId, $versions.children[idx]);
            pendingLoadId = null;
          }
        });
      }
    });
  }

  /* ---------- получить список версий ---------- */
  loadList();

  async function loadList() {
    try {
      const list = await request(`/practice/${type}/versions`);
      renderList(list);
    } catch (e) { console.warn(e.message); }
  }

  /* ---------- рендер списка ---------- */
  let lastActiveId = null;
  let pendingLoadId = null;
  let editorReady = false;

  function renderList(arr) {
    if (!arr.length) return;
    $versions.innerHTML = '';
    arr.forEach(v => {
      const btn = document.createElement('div');
      btn.className   = 'version-item';
      btn.textContent = new Date(v.createdAt).toLocaleString();
      let icon = '';
      if (v.status === 'pending') icon = '⏳';
      if (v.status === 'accepted') icon = '✅';
      if (v.status === 'rework') icon = '✏️';
      if (icon) {
        btn.innerHTML = `<span class="version-status-icon">${icon}</span> <span>${btn.textContent}</span>`;
      }
      btn.onclick     = () => loadVersion(v.id, btn);
      btn.dataset.id = v.id;
      $versions.append(btn);
    });
    let activeIdx = 0;
    if (lastActiveId) {
      activeIdx = arr.findIndex(v => v.id == lastActiveId);
      if (activeIdx < 0) activeIdx = 0;
    }
    pendingLoadId = arr[activeIdx].id;
    // Если редактор уже готов, загружаем сразу
    if (editorReady && window.tinymce && window.tinymce.get('editor')) {
      loadVersion(pendingLoadId, $versions.children[activeIdx]);
      pendingLoadId = null;
    }
  }

  /* ---------- загрузить выбранную версию ---------- */
  async function loadVersion(id, el, tryCount = 0) {
    // Если редактор не готов — повторить попытку через 100мс, максимум 10 раз
    if (!window.tinymce || !window.tinymce.get('editor')) {
      if (tryCount < 10) setTimeout(() => loadVersion(id, el, tryCount + 1), 100);
      return;
    }
    document.querySelectorAll('.version-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    lastActiveId = id;
    try {
      const v = await request(`/practice/${type}/version/${id}`);
      window.tinymce.get('editor').setContent(v.content || '');
    } catch (e) { alert(e.message); }
  }

  /* ---------- отправить на проверку ---------- */
  document.querySelector('.actions button[onclick]').onclick = async () => {
    const active = document.querySelector('.version-item.active');
    if (!active) return alert('Нет выбранной версии!');
    const id = active.dataset.id;
    try {
      await request(`/practice/${type}/send/${id}`, { method: 'POST' });
      await loadList();
      alert('Версия отправлена на проверку!');
    } catch (e) { alert(e.message); }
  };

  /* ---------- сохранить новую версию ---------- */
  document.getElementById('save-btn').onclick = async () => {
    try {
      let content = '';
      if (window.tinymce && window.tinymce.get('editor')) {
        content = window.tinymce.get('editor').getContent();
      } else {
        content = document.getElementById('editor').value;
      }
      await request(`/practice/${type}/save`, {
        method:'POST',
        body:{ content }
      });
      await loadList();                               // перерисовать список
      alert('Сохранено!');
    } catch (e) { alert(e.message); }
  };

  // Функция построения оглавления
  function buildToc(editor) {
    const toc = document.getElementById('toc');
    if (!toc) return;
    const content = editor.getContent();
    // Парсим HTML и ищем заголовки
    const temp = document.createElement('div');
    temp.innerHTML = content;
    const headings = temp.querySelectorAll('h1, h2, h3, h4');
    let html = '<div class="toc-title">Оглавление</div>';
    if (headings.length === 0) {
      html += '<div style="opacity:.6;">Нет заголовков</div>';
    } else {
      headings.forEach((h, i) => {
        // Гарантируем уникальный id
        h.id = 'toc-h-' + i;
        html += `<div class="toc-item toc-${h.tagName.toLowerCase()}" data-toc-id="${h.id}">${h.textContent}</div>`;
      });
    }
    toc.innerHTML = html;
    // Навешиваем обработчик на клик по пункту оглавления
    toc.querySelectorAll('.toc-item').forEach(item => {
      item.onclick = function() {
        const id = this.getAttribute('data-toc-id');
        const edoc = editor.getDoc();
        if (edoc) {
          const el = edoc.getElementById(id);
          if (el) {
            el.scrollIntoView({behavior: 'smooth', block: 'center'});
            // Также можно выделить заголовок визуально:
            el.classList.add('toc-highlight');
            setTimeout(() => el.classList.remove('toc-highlight'), 1200);
          }
        }
      };
    });
    // Проставляем id в реальный контент TinyMCE
    const edoc = editor.getDoc();
    if (edoc) {
      const realHeadings = edoc.querySelectorAll('h1, h2, h3, h4');
      realHeadings.forEach((h, i) => {
        h.id = 'toc-h-' + i;
      });
    }
  }
}
