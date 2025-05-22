import { request } from '@/api/http.js';
import { t, onLangChange } from '@/i18n';
import { navigate } from '@/router';
import { setUser } from '@/store';

/**
 * Форма входа с HTML5-валидацией:
 * браузер сам покажет всплывающее сообщение, если email неверен
 * или пароль короче 4 символов.
 */
class LoginForm extends HTMLElement {
  connectedCallback() {
    this.render();
    this.offLang = onLangChange(() => this.render());
    this.addEventListener('submit', this.onSubmit);
  }

  disconnectedCallback() {
    this.offLang?.();
    this.removeEventListener('submit', this.onSubmit);
  }

  async render() {
    this.innerHTML = `
      <div class="card container" style="max-width:420px;margin-top:var(--space-l)">
        <form id="form" novalidate>
          <h2>${await t('login.title') ?? 'Вход в систему'}</h2>

          <label class="login-field">
            ${await t('login.email') ?? 'Эл. почта'}
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </label>

          <label class="login-field">
            ${await t('login.password') ?? 'Пароль'}
            <input
              name="password"
              type="password"
              required
              minlength="4"
              placeholder="••••"
            />
          </label>

          <button class="btn-accent" type="submit">
            ${await t('login.button') ?? 'Войти'}
          </button>
        </form>
      </div>
    `;
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    /* встроенная проверка */
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await request('/auth/login', { method: 'POST', body: data });
      setUser(res.user);
      navigate('/');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };
}

customElements.define('login-form', LoginForm);
