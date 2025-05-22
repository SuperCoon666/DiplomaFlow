/* src/router/index.js – полный файл */
import showLogin            from '@/pages/login.js';
import showDashboard        from '@/pages/dashboard-student.js';
import showChat             from '@/pages/chat.js';
import showPracticeProject  from '@/pages/practice-project.js';
import showPracticeTech     from '@/pages/practice-tech.js';
import showPracticePre      from '@/pages/practice-pre.js';

/* --------- таблица маршрутов приложения --------- */
const routes = {
  '/':                    showDashboard,
  '/login':               showLogin,
  '/chat':                showChat,
  '/practice/project':    showPracticeProject,
  '/practice/tech':       showPracticeTech,
  '/practice/pre':        showPracticePre,
};

/* ------------------------------------------------
   Инициализация роутера. Запускается один раз
   из  main.js  ->  initRouter()
--------------------------------------------------*/
export function initRouter() {
  /* реагируем на кнопку «назад/вперёд» в браузере */
  window.addEventListener('popstate', () => render(window.location.pathname));

  /* ловим все ссылки с атрибутом data-link
     и обрабатываем без перезагрузки страницы */
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (!link) return;
    e.preventDefault();
    navigate(link.getAttribute('href'));
  });

  /* первый рендер при загрузке страницы */
  render(window.location.pathname);
}

/* ------------------------------------------------
   Перейти по маршруту
--------------------------------------------------*/
export function navigate(path) {
  if (path === window.location.pathname) return;          // уже на этой странице
  history.pushState(null, '', path);
  render(path);
}

/* ------------------------------------------------
   Отрисовать страницу по пути `path`
--------------------------------------------------*/
function render(path) {
  const page = routes[path] || showLogin;                 // fallback: страница логина
  page();
}
