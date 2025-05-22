/* src/components/modal.js – полный файл */

/* ------------------------------------------------------------
   Одна «глобальная» переменная-ссылка на текущий оверлей.
   Если модалка уже открыта, при повторном вызове showModal()
   сначала закрываем старую, потом создаём новую.
----------------------------------------------------------------*/
let overlay = null;

/* ---------------- Показать модальное окно ------------------- */
export function showModal(title, text) {
  // если уже есть открытая модалка — закрываем
  if (overlay) closeModal();

  /* сам оверлей (тёмный фон) */
  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  /* содержимое модального окна */
  overlay.innerHTML = /*html*/`
    <div class="modal" role="dialog" aria-modal="true">
      <h3>${title}</h3>
      <p>${text}</p>
      <button class="btn-accent" id="modal-ok">ОК</button>
    </div>
  `;

  document.body.append(overlay);

  /* закрытие по кнопке «ОК» или клику по фону */
  document.getElementById('modal-ok').onclick = closeModal;
  overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };

  /* блокируем прокрутку страницы под модалкой */
  document.body.style.overflow = 'hidden';
}

/* ---------------- Закрыть модальное окно -------------------- */
export function closeModal() {
  if (!overlay) return;
  overlay.remove();
  overlay = null;
  document.body.style.overflow = '';
}
