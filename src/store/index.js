const state = {
  user: null // { email, role }
};
const listeners = new Set();

export function setUser(user) {
  state.user = user;
  listeners.forEach((fn) => fn(state.user));
}

export function getUser() {
  return state.user;
}

export function onUserChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
