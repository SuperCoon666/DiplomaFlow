// src/router/index.js
import showDashboard       from '@/pages/dashboard-student.js';
import showLogin           from '@/pages/login.js';
import showPracticeProject from '@/pages/practice-project.js';
import showPracticeTech    from '@/pages/practice-tech.js';
import showPracticePre     from '@/pages/practice-pre.js';

const routes = {
  '/':                   showDashboard,
  '/login':              showLogin,
  '/practice/project':   showPracticeProject,
  '/practice/tech':      showPracticeTech,
  '/practice/pre':       showPracticePre
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
  const view = routes[location.pathname] ?? showLogin;
  view();
}
