import { request } from '@/api/http.js';
import { t, onLangChange } from '@/i18n';

class LoginForm extends HTMLElement {
  connectedCallback() {
    this.render();
    this.unsubscribe = onLangChange(() => this.render());
    this.addEventListener('submit', this.onSubmit);
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.removeEventListener('submit', this.onSubmit);
  }

  async render() {
    this.innerHTML = `
      <div class="card container" style="max-width:420px;margin-top:var(--space-l)">
        <form id="form" novalidate>
          <h2 style="text-align:center">${await t('login.title') ?? 'Вход в систему'}</h2>

          <label>
            ${await t('login.email') ?? 'Эл. почта'}
            <input name="email" type="email" required />
          </label>

          <label>
            ${await t('login.password') ?? 'Пароль'}
            <input name="password" type="password" required />
          </label>

          <button class="accent" style="width:100%" type="submit">
            ${await t('login.button') ?? 'Войти'}
          </button>
        </form>
      </div>
    `;
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await request('/auth/login', { method: 'POST', body: data });
      location.href = '/';
    } catch (err) {
      alert('Ошибка входа: ' + err.message);
    }
  };
}

customElements.define('login-form', LoginForm);
