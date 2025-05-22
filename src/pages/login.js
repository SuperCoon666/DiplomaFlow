import '@/components/login-form.js';

export default function showLogin() {
  document.querySelector('#app').innerHTML = `
    <login-form></login-form>
  `;
}
