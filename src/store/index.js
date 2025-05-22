/* Глобальное хранилище сведений о текущем пользователе
   + удобные функции get/set/clear
   + автоматическое сохранение в localStorage */

let user = null;

/* при старте пробуем прочитать сохранённое состояние */
try {
  user = JSON.parse(localStorage.getItem('user') || 'null');
} catch {
  user = null;
}

export function getUser() {
  return user;
}

export function setUser(u) {
  user = u;
  localStorage.setItem('user', JSON.stringify(u));
}

export function clearUser() {
  user = null;
  localStorage.removeItem('user');
}
