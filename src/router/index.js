/* src/router/index.js – полный файл */
import { getUser } from '@/store';
import showLogin            from '@/pages/login.js';
import showDashboardStudent from '@/pages/dashboard-student.js';
import showDashboardTeacher from '@/pages/dashboard-teacher.js';
import showChat             from '@/pages/chat.js';
import showPracticeProject  from '@/pages/practice-project.js';
import showPracticeTech     from '@/pages/practice-tech.js';
import showPracticePre      from '@/pages/practice-pre.js';
import showStudentCard      from '@/pages/student-card.js';

/* --------- таблица маршрутов приложения --------- */
const routes = {
  '/': () => (getUser()?.role === 'TEACHER'
             ? showDashboardTeacher()
             : showDashboardStudent()),
  '/login':               showLogin,
  '/chat':                showChat,
  '/practice/project':    showPracticeProject,
  '/practice/tech':       showPracticeTech,
  '/practice/pre':        showPracticePre,
  '/student/:sid':        showStudentCard,
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
  window.dispatchEvent(new Event('va-update-panel'));
}

/* ------------------------------------------------
   Отрисовать страницу по пути `path`
--------------------------------------------------*/
function matchRoute(path){
  for (const pattern in routes){
    if (!pattern.includes(':')) continue;
    const regex   = new RegExp('^'+pattern.replace(/:[^/]+/g,'([^/]+)')+'$');
    const matches = path.match(regex);
    if (matches){
      const keys = (pattern.match(/:[^/]+/g) || []).map(k=>k.slice(1));
      const params = Object.fromEntries(keys.map((k,i)=>[k,matches[i+1]]));
      return { page: routes[pattern], params };
    }
  }
  return null;
}

function render(path) {
  const pathname = path.split('?')[0];
  // exact match
  if (routes[pathname]) return routes[pathname]();

  // dynamic match  (/student/123 → /student/:sid)
  const m = matchRoute(pathname);
  if (m) return m.page({ params:m.params });

  // fallback
  showLogin();
}
