import '@/components/login-form.js';

export default function showLogin() {
  document.querySelector('#app').innerHTML = `
    <section style="max-width:420px;margin:2rem auto">
      <login-form></login-form>
    </section>
  `;
}
