/* ------------------ Пользователь ------------------ */
let user = null;
try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch { user = null; }

export const getUser   = ()       => user;
export const setUser   = (u)      => { user = u; localStorage.setItem('user', JSON.stringify(u)); };
export const clearUser = ()       => { user = null; localStorage.removeItem('user'); };

/* ------------------ Выход ------------------ */
export function logout() {
  clearUser();
  location.href = '/login';               /* полный reset, чтобы очистить состояние SPA */
}
