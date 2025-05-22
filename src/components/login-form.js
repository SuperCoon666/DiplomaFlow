import { request } from '@/api/http.js';
import { t, onLangChange } from '@/i18n';
import { navigate } from '@/router';
import { setUser } from '@/store';

/**
 * Форма входа: теперь валидация полностью отдана
 * встроенным механизмам браузера (HTML5 constraint validation).
 * При некорректном email или слишком коротком пароле
 * появится стандартное всплывающее сообщение.
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
          <h2 style="text-align:center">${await t('login.title') ?? 'Вход в систему'}</h2>

          <label>
            ${await t('login.email') ?? 'Эл. почта'}
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </label>

          <label>
            ${await t('login.password') ?? 'Пароль'}
            <input
              name="password"
              type="password"
              required
              minlength="4"
              placeholder="••••"
            />
          </label>

          <button class="accent" style="width:100%" type="submit">
            ${await t('login.button') ?? 'Войти'}
          </button>
        </form>
      </div>
    `;
  }

  /** Используем встроенную браузерную проверку. */
  onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // если есть ошибки — браузер покажет всплывающие подсказки
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: data
      });
      setUser(res.user);   // сохраняем пользователя и его роль
      navigate('/');       // переходим на приветственную страницу
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };
}

customElements.define('login-form', LoginForm);
