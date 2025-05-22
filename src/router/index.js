import showLogin from '@/pages/login.js';
import showStudent from '@/pages/dashboard-student.js';
import showTeacher from '@/pages/dashboard-teacher.js';
import showAdmin from '@/pages/dashboard-admin.js';
import { getUser } from '@/store';

const routeTable = {
  student: showStudent,
  teacher: showTeacher,
  admin: showAdmin
};

export function initRouter() {
  window.addEventListener('popstate', resolve);
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      e.preventDefault();
      navigate(link.getAttribute('href'));
    }
  });
  resolve();
}

function navigate(url) {
  history.pushState({}, '', url);
  resolve();
}

function resolve() {
  const { pathname } = location;
  const user = getUser();

  if (pathname === '/login') {
    showLogin();
    return;
  }

  if (!user) {
    navigate('/login');
    return;
  }

  const page = routeTable[user.role] ?? showStudent;
  page();
}

export { navigate };
