import showDashboard       from '@/pages/dashboard-student.js';
import showLogin           from '@/pages/login.js';
import showPracticeProject from '@/pages/practice-project.js';
import showPracticeTech    from '@/pages/practice-tech.js';
import showPracticePre     from '@/pages/practice-pre.js';
import showChat            from '@/pages/chat.js';
import { getUser }         from '@/store';

const routes = {
  '/':                   showDashboard,
  '/login':              showLogin,
  '/practice/project':   showPracticeProject,
  '/practice/tech':      showPracticeTech,
  '/practice/pre':       showPracticePre,
  '/chat':               showChat
};

export function initRouter() {
  window.addEventListener('popstate', resolve);
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (!link) return;
    e.preventDefault();
    navigate(link.getAttribute('href'));
  });
  resolve();
}

export function navigate(url) {
  history.pushState({}, '', url);
  resolve();
}

function resolve() {
  const user = getUser();
  const isLogin = location.pathname === '/login';

  /* если не залогинен – пускаем только на /login */
  if (!user && !isLogin) {
    history.replaceState({}, '', '/login');
    return showLogin();
  }
  /* если залогинен, но попал на /login – перекидываем домой */
  if (user && isLogin) {
    history.replaceState({}, '', '/');
    return showDashboard();
  }

  const view = routes[location.pathname] ?? showDashboard;
  view();
}
