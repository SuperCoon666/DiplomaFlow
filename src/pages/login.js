import '@/components/login-form.js';

export default function showLogin() {
  document.querySelector('#app').innerHTML = `
    <div class="page-center">
      <login-form></login-form>
    </div>
  `;
}
