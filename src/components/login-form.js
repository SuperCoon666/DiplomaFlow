import { request } from '@/api/http.js';
import { t, onLangChange } from '@/i18n';
import { navigate } from '@/router';
import { setUser } from '@/store';

class LoginForm extends HTMLElement {
  connectedCallback(){
    this.render();
    this.off = onLangChange(()=>this.render());
    this.addEventListener('submit',this.onSubmit);
    this.addEventListener('click', e=>{
      const b=e.target.closest('.btn-accent[data-role]');
      if(!b) return;
      this.querySelector('input[name=role]').value = b.dataset.role;
    });
  }
  disconnectedCallback(){
    this.off?.();
    this.removeEventListener('submit',this.onSubmit);
  }

  async render(){
    this.innerHTML=`
      <div class="card login-card">
        <form id="form" novalidate>
          <h2 style="text-align:center">${await t('login.title') ?? 'Вход в систему'}</h2>

          <div class="login-field">
            <label for="email">${await t('login.email') ?? 'Эл. почта'}</label>
            <input id="email" name="email" type="email" required placeholder="name@example.com">
          </div>

          <div class="login-field">
            <label for="pass">${await t('login.password') ?? 'Пароль'}</label>
            <input id="pass" name="password" type="password" required minlength="4" placeholder="••••">
          </div>

          <input type="hidden" name="role" value="STUDENT">
          <div class="login-btns">
            <button type="submit" class="btn-accent" data-role="STUDENT">Войти как студент</button>
            <button type="submit" class="btn-accent" data-role="TEACHER">Войти как преподаватель</button>
          </div>
        </form>
      </div>`;
  }

  onSubmit = async (e)=>{
    e.preventDefault();
    const form=e.target;
    if(!form.checkValidity()){form.reportValidity();return;}
    const data=Object.fromEntries(new FormData(form));
    try{
      const res=await request('/auth/login',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setUser(res.user);navigate('/');
    }catch(err){alert('Ошибка: '+err.message);}
  };
}
customElements.define('login-form',LoginForm);
