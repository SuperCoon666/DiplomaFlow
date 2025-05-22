// src/router/index.js
import showDashboard from '@/pages/dashboard.js';
import showLogin from '@/pages/login.js';

const routes = {
  '/': showDashboard,   // главная
  '/login': showLogin   // форма входа
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
  resolve();            // первая отрисовка
}

function navigate(url) {
  history.pushState({}, '', url);
  resolve();
}

function isLoggedIn() {
  return Boolean(document.cookie.match(/jwt=([^;]+)/));
}

function resolve() {
  const path = location.pathname;

  // если пользователь НЕ залогинен и просит любую страницу, кроме /login,
  // отправляем на /login
  if (!isLoggedIn() && path !== '/login') {
    history.replaceState({}, '', '/login');
    routes['/login']();
    return;
  }

  // если пользователь УЖЕ залогинен, а в адресе /login — перенаправляем на /
  if (isLoggedIn() && path === '/login') {
    history.replaceState({}, '', '/');
    routes['/']();
    return;
  }

  // обычное отображение
  (routes[path] ?? routes['/login'])();
}
