/* src/components/modal.js – полный файл */

/* ------------------------------------------------------------
   Одна «глобальная» переменная-ссылка на текущий оверлей.
   Если модалка уже открыта, при повторном вызове showModal()
   сначала закрываем старую, потом создаём новую.
----------------------------------------------------------------*/
let overlay = null;

/* ---------------- Показать модальное окно ------------------- */
export function showModal(title, html, onOpen) {
  if (overlay) closeModal();

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = /*html*/`
    <div class="modal" role="dialog" aria-modal="true">
      <h3>${title}</h3>
      ${html}
      <button id="modal-ok" class="btn-accent" style="margin-top:24px">OK</button>
    </div>`;

  document.body.append(overlay);
  if (onOpen) onOpen(overlay);

  document.getElementById('modal-ok').onclick = closeModal;
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  document.body.style.overflow = 'hidden';
}

/* ---------------- Закрыть модальное окно -------------------- */
export function closeModal() {
  if (!overlay) return;
  overlay.remove();
  overlay = null;
  document.body.style.overflow = '';
}

/* ---------------- Модальное окно с подтверждением ------------------- */
export function showConfirmModal(title, text, onOk, onCancel) {
  if (overlay) closeModal();
  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = /*html*/`
    <div class="modal" role="dialog" aria-modal="true">
      <h3>${title}</h3>
      <p>${text}</p>
      <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:18px;">
        <button class="btn-accent" id="modal-cancel">Отмена</button>
        <button class="btn-accent" id="modal-ok">Выйти</button>
      </div>
    </div>
  `;
  document.body.append(overlay);
  document.getElementById('modal-ok').onclick = () => { closeModal(); onOk && onOk(); };
  document.getElementById('modal-cancel').onclick = () => { closeModal(); onCancel && onCancel(); };
  overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
  document.body.style.overflow = 'hidden';
}
