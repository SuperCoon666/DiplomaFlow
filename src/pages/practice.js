/* src/pages/practice.js — универсальный файл для всех практик */
import { request }  from '../api/http.js';
import { navigate } from '../router/index.js';
import { getUser } from '../store/index.js';
import { showTextareaModal } from '../components/modal.js';

/* ---------------- страница ---------------- */
export default function ({ params, query }) {
  const practiceId = params.pid;
  // Название практики получаем из параметра в URL
  const practiceName = query.name || 'Практика';
  
  showEditor(practiceId, practiceName);
}

/* ------------------------------------------------------------- */
function showEditor(practiceId, title) {
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
          <div id="editor-container">
            <textarea id="editor"></textarea>
          </div>

          <div class="actions">
            <button class="btn-accent" id="save-btn">Сохранить</button>
            <button class="btn-accent" onclick="navigate('/')">На проверку</button>
          </div>
        </div>
      </section>
    </main>
  `;

  const $versions = document.getElementById('versions');

  let lastActiveId = null;

  /* ---------- инициализация TinyMCE ---------- */
  window.tinymce.init({
    selector: '#editor',
    language: 'ru',
    height: '100%',
    menubar: 'file edit view insert format tools table',
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media link anchor codesample | ltr rtl',
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_prefix: '{path}{query}-{id}-',
    autosave_restore_when_empty: false,
    autosave_retention: '2m',
    setup: (editor) => {
      editor.on('init', () => {
        // Загружаем список версий только после инициализации редактора
        loadVersionsList(practiceId);
      });
    },
  }).catch(err => {
    console.error("Ошибка инициализации TinyMCE:", err);
    document.querySelector('#editor-container').innerHTML = 
      `<p style="color:red; text-align:center;">Не удалось загрузить редактор. Попробуйте обновить страницу.</p>`;
  });

  // Переменная для хранения списка версий, чтобы не запрашивать их повторно
  let versionsCache = [];

  /* -------------------------------------------------------------
   * Загрузка и рендер списка версий
   * ------------------------------------------------------------- */
  async function loadVersionsList(practiceId) {
    const versionsPanel = document.getElementById('versions');
    try {
      // Возвращаем реальный запрос к API
      const list = await request(`/practices/${practiceId}/versions`);
      versionsCache = list; // Сохраняем список в кеш
      
      renderVersionsList(list);

      if (list && list.length > 0) {
        const firstVersionId = list[0].id;
        // Находим соответствующий элемент в списке
        const firstVersionElement = document.querySelector(`.versions-list li[data-id="${firstVersionId}"]`);
        if (firstVersionElement) {
          loadVersion(firstVersionId, firstVersionElement);
        }
      }
    } catch (e) { 
      console.warn(e.message); 
      // Если версий нет, можно показать сообщение в списке
      document.querySelector('.versions-list ul').innerHTML = '<li>Нет сохраненных версий</li>';
    }
  }

  /* ---------- отрисовать список версий ---------- */
  function renderVersionsList(list) {
    if (!list.length) return;
    $versions.innerHTML = `
      <ul class="versions-list">
        ${list.map(v => {
          let icon = '';
          if (v.status === 'pending') icon = '⏳';
          if (v.status === 'accepted') icon = '✅';
          if (v.status === 'rework') icon = '✏️';
          const date = new Date(v.uploadTime).toLocaleString();
          const content = icon 
            ? `<span class="version-status-icon">${icon}</span> <span>${date}</span>` 
            : date;
          return `<li class="version-item" data-id="${v.id}">${content}</li>`;
        }).join('')}
      </ul>
    `;
    // навешиваем события
    const items = document.querySelectorAll('.versions-list li');
    items.forEach(el => {
      el.onclick = () => loadVersion(el.dataset.id, el);
    });
  }

  /* ---------- загрузить выбранную версию ---------- */
  function loadVersion(id, el) {
    if (!window.tinymce || !window.tinymce.get('editor')) {
      console.error("Редактор не готов, загрузка версии отменена.");
      return;
    }

    // снимаем класс со старого активного элемента
    document.querySelectorAll('.versions-list li').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    lastActiveId = id;

    // Ищем версию в кеше, а не делаем новый запрос
    const version = versionsCache.find(v => v.id == id);
    if (version) {
      window.tinymce.get('editor').setContent(version.content || '');
    } else {
      alert(`Не удалось найти данные для версии с ID: ${id}`);
      window.tinymce.get('editor').setContent('');
    }
  }

  /* ---------- отправить на проверку ---------- */
  document.querySelector('.actions button[onclick]').onclick = async () => {
    const active = document.querySelector('.version-item.active');
    if (!active) return alert('Нет выбранной версии!');
    const id = active.dataset.id;
    try {
      await request(`/practices/${practiceId}/versions/${id}/send`, { method: 'POST' });
      await loadVersionsList(practiceId);
      alert('Версия отправлена на проверку!');
    } catch (e) { alert(e.message); }
  };

  /* ---------- сохранить новую или обновить существующую версию ---------- */
  document.getElementById('save-btn').onclick = async () => {
    try {
      if (!window.tinymce || !window.tinymce.get('editor')) {
        return alert("Редактор не инициализирован.");
      }
      const content = window.tinymce.get('editor').getContent();
      if (!content.trim()) {
        return alert("Отчет пуст. Нечего сохранять.");
      }

      const requestBody = {
        method: 'POST', // По умолчанию создаем новую
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      };
      
      let url = `/practices/${practiceId}/versions`;

      // Если мы редактируем существующую версию - меняем метод на PUT
      if (lastActiveId) {
        requestBody.method = 'PUT';
        // ИСПРАВЛЕНИЕ: Используем правильный эндпоинт для обновления
        url = `/practices/versions/${lastActiveId}`;
      }

      const savedVersion = await request(url, requestBody);
      
      alert('Сохранено!');
      // После сохранения перезагружаем список версий, чтобы увидеть изменения
      await loadVersionsList(practiceId);
      // И сразу делаем новую сохраненную версию активной
      const newActiveElement = document.querySelector(`.version-item[data-id="${savedVersion.id}"]`);
      if (newActiveElement) {
        loadVersion(savedVersion.id, newActiveElement);
      }

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

  function currentVersionId(){
    const a=document.querySelector('.version-item.active');
    return a ? a.dataset.id : null;
  }

  const me = getUser();
  const isTeacher = me?.role === 'TEACHER';
  const $actions = document.querySelector('.actions');

  if (isTeacher) {
    $actions.innerHTML = `
      <button class="btn-accent" id="rework-btn">Правки</button>
      <button class="btn-accent" id="accept-btn">Принять</button>`;

    document.getElementById('accept-btn').onclick = async () => {
      const id = currentVersionId();
      if (!id) return alert('Нет версии');
      await request(`/practices/${practiceId}/versions/${id}/accept`, { method: 'PUT' });
      await loadVersionsList(practiceId);
    };
    document.getElementById('rework-btn').onclick = () => {
      const id = currentVersionId();
      if (!id) return alert('Нет версии');
      showTextareaModal('Замечания', async (txt) => {
        await request(`/practices/${practiceId}/versions/${id}/rework`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: txt })
        });
        await loadVersionsList(practiceId);
      });
    };
  } else {
    document.querySelector('.actions button[onclick]').onclick = async () => {
      const active = document.querySelector('.version-item.active');
      if (!active) return alert('Нет выбранной версии!');
      const id = active.dataset.id;
      try {
        await request(`/practices/${practiceId}/versions/${id}/send`, { method: 'POST' });
        await loadVersionsList(practiceId);
        alert('Версия отправлена на проверку!');
      } catch (e) { alert(e.message); }
    };
    document.getElementById('save-btn').onclick = async () => {
      try {
        let content = '';
        if (window.tinymce && window.tinymce.get('editor')) {
          content = window.tinymce.get('editor').getContent();
        } else {
          content = document.getElementById('editor').value;
        }
        await request(`/practices/${practiceId}/versions`, {
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        await loadVersionsList(practiceId);
        alert('Сохранено!');
      } catch (e) { alert(e.message); }
    };
  }

  async function saveBlocks() {
    if (!lastActiveId) {
      alert("Не выбрана версия для сохранения!");
      return;
    }

    const blockElements = document.querySelectorAll('#editor-container .editor-block');
    const blocksData = [];
    blockElements.forEach((el, index) => {
      // Блоки без текста пропускаем, чтобы не сохранять пустоту
      const content = el.querySelector('textarea').value;
      if (!content.trim()) return;

      blocksData.push({
        id: el.dataset.id ? parseInt(el.dataset.id, 10) : null,
        orderNumber: index + 1,
        contentType: el.querySelector('select').value,
        content: content
      });
    });
    
    try {
      // Отправляем массив блоков на сервер для сохранения
      await request(`/practices/versions/${lastActiveId}/blocks`, {
        method: 'PUT', // Используем PUT для полного обновления списка блоков
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blocksData)
      });
      alert("Изменения успешно сохранены!");
      
    } catch (e) {
      alert(`Ошибка при сохранении: ${e.message}`);
    }
  }
}
