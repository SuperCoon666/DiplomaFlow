// src/components/login-form.js
import { request } from '@/api/http.js';
import { t, onLangChange } from '@/i18n';

class LoginForm extends HTMLElement {
  connectedCallback() {
    this.render();                       // первая отрисовка
    this.off = onLangChange(() => this.render()); // перерисовать при смене языка
    this.addEventListener('submit', this.onSubmit);
  }

  disconnectedCallback() {               // уборка слушателей, если элемент удалён
    this.off?.();
    this.removeEventListener('submit', this.onSubmit);
  }

  async render() {
    this.innerHTML = `
      <form id="form" style="max-width:340px;margin:40px auto;padding:24px;border:1px solid #ddd;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.05)">
        <h2 style="text-align:center;margin-top:0">${await t('login.title') ?? 'Вход в систему'}</h2>
  
        <label>
          ${await t('login.email') ?? 'Эл. почта'}
          <input name="email" type="email" required />
        </label>
  
        <label>
          ${await t('login.password') ?? 'Пароль'}
          <input name="password" type="password" required />
        </label>
  
        <button class="accent" type="submit" style="width:100%">
          ${await t('login.button') ?? 'Войти'}
        </button>
      </form>
    `;
  }  

  onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await request('/auth/login', { method: 'POST', body: data });
      location.href = '/'; // после успешного входа переносим на главную
    } catch (err) {
      alert('Ошибка входа: ' + err.message);
    }
  };
}

customElements.define('login-form', LoginForm);
