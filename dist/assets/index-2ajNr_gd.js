var K=Object.defineProperty;var W=(n,o,i)=>o in n?K(n,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[o]=i;var U=(n,o,i)=>W(n,typeof o!="symbol"?o+"":o,i);(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const l of e)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function i(e){const l={};return e.integrity&&(l.integrity=e.integrity),e.referrerPolicy&&(l.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?l.credentials="include":e.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(e){if(e.ep)return;e.ep=!0;const l=i(e);fetch(e.href,l)}})();let q=null;try{q=JSON.parse(localStorage.getItem("user")||"null")}catch{q=null}const C=()=>q,G=n=>{q=n,localStorage.setItem("user",JSON.stringify(n))},Q=()=>{q=null,localStorage.removeItem("user")};function X(){Q(),location.href="/login"}const Y=void 0;async function m(n,o={}){const i=n.startsWith("/api")?n.slice(4):n,r=await fetch(Y+"/api"+i,o);if(!r.ok)throw new Error(await r.text());return r.status===204?null:r.json()}const Z="modulepreload",tt=function(n){return"/"+n},D={},_=function(o,i,r){let e=Promise.resolve();if(i&&i.length>0){let d=function(h){return Promise.all(h.map(v=>Promise.resolve(v).then(k=>({status:"fulfilled",value:k}),k=>({status:"rejected",reason:k}))))};document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),p=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));e=d(i.map(h=>{if(h=tt(h),h in D)return;D[h]=!0;const v=h.endsWith(".css"),k=v?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${k}`))return;const w=document.createElement("link");if(w.rel=v?"stylesheet":Z,v||(w.as="script"),w.crossOrigin="",w.href=h,p&&w.setAttribute("nonce",p),document.head.appendChild(w),v)return new Promise((B,t)=>{w.addEventListener("load",B),w.addEventListener("error",()=>t(new Error(`Unable to preload CSS for ${h}`)))})}))}function l(d){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=d,window.dispatchEvent(u),!u.defaultPrevented)throw d}return e.then(d=>{for(const u of d||[])u.status==="rejected"&&l(u.reason);return o().catch(l)})},J={ru:()=>_(()=>import("./ru-D20292nO.js"),[]),en:()=>_(()=>import("./en-B4_q1_UL.js"),[])};let x=localStorage.getItem("lang")||"ru";const A={},M=new Set;function z(n){!(n in J)||n===x||(x=n,localStorage.setItem("lang",n),M.forEach(o=>o(x)))}const V=()=>x;function N(n){return M.add(n),()=>M.delete(n)}async function P(n){return A[x]||(A[x]=await J[x]().then(o=>o.default)),A[x][n]??n}class et extends HTMLElement{constructor(){super(...arguments);U(this,"onSubmit",async i=>{i.preventDefault();const r=i.target;if(!r.checkValidity()){r.reportValidity();return}const e=Object.fromEntries(new FormData(r));try{const l=await m("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});G(l.user),L("/")}catch(l){alert("Ошибка: "+l.message)}})}connectedCallback(){this.render(),this.off=N(()=>this.render()),this.addEventListener("submit",this.onSubmit),this.addEventListener("click",i=>{const r=i.target.closest(".btn-accent[data-role]");r&&(this.querySelector("input[name=role]").value=r.dataset.role)})}disconnectedCallback(){var i;(i=this.off)==null||i.call(this),this.removeEventListener("submit",this.onSubmit)}async render(){this.innerHTML=`
      <div class="card login-card">
        <form id="form" novalidate>
          <h2 style="text-align:center">${await P("login.title")??"Вход в систему"}</h2>

          <div class="login-field">
            <label for="email">${await P("login.email")??"Эл. почта"}</label>
            <input id="email" name="email" type="email" required placeholder="name@example.com">
          </div>

          <div class="login-field">
            <label for="pass">${await P("login.password")??"Пароль"}</label>
            <input id="pass" name="password" type="password" required minlength="4" placeholder="••••">
          </div>

          <input type="hidden" name="role" value="STUDENT">
          <div class="login-btns">
            <button type="submit" class="btn-accent" data-role="STUDENT">Войти как студент</button>
            <button type="submit" class="btn-accent" data-role="TEACHER">Войти как преподаватель</button>
          </div>
        </form>
      </div>`}}customElements.define("login-form",et);function F(){document.querySelector("#app").innerHTML=`
    <div class="page-center">
      <login-form></login-form>
    </div>
  `}let f=null;function O(n,o,i){f&&S(),f=document.createElement("div"),f.className="modal-overlay",f.innerHTML=`
    <div class="modal" role="dialog" aria-modal="true">
      <h3>${n}</h3>
      ${o}
      <button id="modal-ok" class="btn-accent" style="margin-top:24px">OK</button>
    </div>`,document.body.append(f),i&&i(f),document.getElementById("modal-ok").onclick=S,f.onclick=r=>{r.target===f&&S()},document.body.style.overflow="hidden"}function S(){f&&(f.remove(),f=null,document.body.style.overflow="")}function nt(n,o,i,r){f&&S(),f=document.createElement("div"),f.className="modal-overlay",f.innerHTML=`
    <div class="modal" role="dialog" aria-modal="true">
      <h3>${n}</h3>
      <p>${o}</p>
      <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:18px;">
        <button class="btn-accent" id="modal-cancel">Отмена</button>
        <button class="btn-accent" id="modal-ok">Выйти</button>
      </div>
    </div>
  `,document.body.append(f),document.getElementById("modal-ok").onclick=()=>{S(),i&&i()},document.getElementById("modal-cancel").onclick=()=>{S()},f.onclick=e=>{e.target===f&&S()},document.body.style.overflow="hidden"}function R(n,o){f&&S(),f=document.createElement("div"),f.className="modal-overlay",f.innerHTML=`
    <div class="modal" role="dialog" aria-modal="true">
      <h3>${n}</h3>
      <textarea id="corr-text" style="width:100%;height:160px"></textarea>
      <div class="btn-row">
        <button class="btn-accent" id="modal-ok">На доработку</button>
        <button class="btn-grey" id="modal-cancel">Отмена</button>
      </div>
    </div>
  `,document.body.append(f),document.getElementById("modal-ok").onclick=()=>{const i=document.getElementById("corr-text").value.trim();o(i),S()},document.getElementById("modal-cancel").onclick=S,f.onclick=i=>{i.target===f&&S()},document.body.style.overflow="hidden"}const it=42;async function ot(){var r;document.querySelector("#app").innerHTML=`
    <main class="container">
      <section class="dashboard-grid">

        <!-- Трекер -------------------------------------------------------------- -->
        <article class="card">
          <h3>Трекер</h3>
          <p style="margin-bottom:var(--gap-s)">Проектная&nbsp;пр.</p>
          <div class="progress"><div style="width:${it}%"></div></div>
        </article>

        <!-- Выполнение ---------------------------------------------------------- -->
        <article class="card practice-list">
          <h3>Выполнение</h3>
          <button class="btn-accent" data-path="/practice/project">Проектная&nbsp;практика</button>
          <button class="btn-accent" data-path="/practice/tech">Технологическая&nbsp;практика</button>
          <button class="btn-accent" data-path="/practice/pre">Преддипломная&nbsp;практика</button>
        </article>

        <!-- Уведомления --------------------------------------------------------- -->
        <article class="card">
          <h3>Уведомления</h3>
          <div id="notif" class="notifications-list"></div>
        </article>

        <!-- Чат ----------------------------------------------------------------- -->
        <article class="card" id="chat-card" style="text-align:center">
          <h3>Чат</h3>
          <svg width="48" height="48" fill="currentColor" style="opacity:.6">
            <use href="#icon-user"></use>
          </svg>
          <p style="margin-top:var(--gap-s)">Научный&nbsp;Руководитель</p>
        </article>

        <!-- Сроки --------------------------------------------------------------- -->
        <article class="card deadline-card">
          <h3>Сроки</h3>
          <p style="font-weight:600">Ближайший:</p>
          <p style="color:#b91c1c">22.03.2025</p>
        </article>

      </section>
    </main>
  `,document.querySelectorAll(".practice-list .btn-accent").forEach(e=>e.onclick=()=>L(e.dataset.path)),document.getElementById("chat-card").onclick=()=>L("/chat");const n=document.getElementById("notif"),o=(r=C())==null?void 0:r.id;let i=[];try{i=await m(`/notifications/${o}`)}catch(e){console.warn(e.message)}n.innerHTML=i.map(e=>`
    <button class="${e.status?"btn-grey":"btn-accent"}"
            data-id="${e.id}"
            data-title="${e.type}"
            data-msg="${e.message}">
      ${e.message}
    </button>`).join(""),n.querySelectorAll(".btn-accent, .btn-grey").forEach(e=>e.onclick=async()=>{O(e.dataset.title,e.dataset.msg),await m(`/notifications/${e.dataset.id}/read`,{method:"PUT"}),e.classList.remove("btn-accent"),e.classList.add("btn-grey")})}async function ct(){const{id:n}=C(),o=await m(`/teacher/${n}/students`),i=await m(`/notifications/${n}`),r=await m(`/teacher/${n}/reviews`);document.querySelector("#app").innerHTML=`
    <div class="container">
      <section class="teacher-grid">
        <article class="card students-card">
          <h3>Студенты</h3>
          <div class="teacher-stu-list">
            ${o.map(e=>`
              <button class="stu-row" data-id="${e.id}">
                <span>${e.name}</span><span>${e.group}</span>
              </button>`).join("")}
          </div>
        </article>

        <article class="card notes-card">
          <h3>Уведомления</h3>
          <div class="notifications-list">
            ${i.map(e=>`
              <button class="${e.status?"btn-grey":"btn-accent"}"
                      data-id="${e.id}">
                ${e.message}
              </button>`).join("")}
          </div>
        </article>
      </section>
      <article class="card review-card">
        <h3>Работы на проверку</h3>
        <div class="review-list">
          <div class="review-header">
            <div>ФИО</div>
            <div>Группа</div>
            <div>Практика</div>
          </div>
          ${r.map(e=>`
            <button class="review-row" data-type="${e.type}">
              <div>${e.name}</div>
              <div>${e.group}</div>
              <div>${e.practice}</div>
            </button>`).join("")}
        </div>
      </article>
    </div>`,document.querySelectorAll(".notifications-list button").forEach(e=>e.onclick=async()=>{const l=i.find(d=>d.id==e.dataset.id);l&&(O(l.type||"Уведомление",l.message),await m(`/notifications/${e.dataset.id}/read`,{method:"PUT"}),e.classList.remove("btn-accent"),e.classList.add("btn-grey"))}),document.querySelectorAll(".review-row").forEach(e=>e.onclick=()=>L(`/practice/${e.dataset.type}`)),document.querySelectorAll(".stu-row").forEach(e=>e.onclick=()=>L(`/student/${e.dataset.id}`))}async function at(){const o=new URLSearchParams(location.search).get("user"),i=C();let r={name:"Научный руководитель",email:"ivanova@uni.ru"};if(o&&i.role==="TEACHER"&&(r=await m("/student/"+o)),document.querySelector("#app").innerHTML=`
    <main class="container">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:var(--gap-s)">
        Чат с&nbsp;${r.name.replace(" ","&nbsp;")}
      </h2>

      <section class="chat-layout">
        <div class="card profile-pane">
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--gap-s)">
            <div id="peer-avatar" style="width:110px;height:110px;border-radius:50%;border:3px solid #cbd5e1;
                        display:flex;align-items:center;justify-content:center;font-size:3rem;">
              👤
            </div>
            <div style="font-size:1.05rem;line-height:1.4;text-align:center">
              <b>${r.name.replace(" ","<br>")}</b><br>
              ${r.email?`<span style="opacity:.7">${r.email}</span>`:""}
            </div>
          </div>
        </div>
        <div class="card dialog-pane">
          <div id="messages" class="messages"></div>
          <form id="chat-form" class="send-box">
            <input id="message" required placeholder="Напишите сообщение…" />
            <button class="btn-accent" style="flex-shrink:0">Отправить</button>
          </form>
        </div>
      </section>
    </main>`,o&&i.role==="TEACHER"){const p=document.getElementById("peer-avatar");p&&(p.style.cursor="pointer",p.onclick=()=>L(`/student/${o}`))}const e=document.getElementById("messages"),l=document.getElementById("chat-form"),d=document.getElementById("message");l.onsubmit=p=>{p.preventDefault();const h=d.value.trim();h&&(u("you",h),setTimeout(()=>u("ru","Приняла, спасибо!"),600),d.value="")};function u(p,h){const v=document.createElement("div");v.className=`bubble ${p}`,v.textContent=h,e.append(v),e.scrollTop=e.scrollHeight}}function st(){rt("project","Проектная практика")}function rt(n,o){document.querySelector("#app").innerHTML=`
    <main class="container">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:var(--gap-s)">
        ${o}
      </h2>

      <section class="editor-layout">
        <div class="side-pane">
          <aside class="versions-pane" id="versions">
            <p style="opacity:.6;text-align:center;margin-top:var(--gap-s)">
              Нет версий
            </p>
          </aside>
          <nav class="toc-pane" id="toc"></nav>
        </div>
        <div class="editor-pane">
          <textarea id="editor"></textarea>

          <div class="actions">
            <button class="btn-accent" id="save-btn">Сохранить</button>
            <button class="btn-accent" onclick="navigate('/')">На проверку</button>
          </div>
        </div>
      </section>
    </main>
  `;const i=document.getElementById("versions");window.tinymce&&(window.tinymce.get("editor")&&window.tinymce.get("editor").remove(),window.tinymce.init({selector:"#editor",language:"ru",height:500,menubar:!0,plugins:["lists","link","code","fullscreen","table","wordcount"],toolbar:"undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | code fullscreen | removeformat | help",content_style:"body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }",setup:function(t){t.on("init change SetContent",function(){h(t)}),t.on("init",function(){if(d=!0,l){const a=Array.from(i.children).findIndex(c=>c.dataset.id==l);a>=0&&p(l,i.children[a]),l=null}})}})),r();async function r(){try{const t=await m(`/practice/${n}/versions`);u(t)}catch(t){console.warn(t.message)}}let e=null,l=null,d=!1;function u(t){if(!t.length)return;i.innerHTML="",t.forEach(a=>{const c=document.createElement("div");c.className="version-item",c.textContent=new Date(a.createdAt).toLocaleString();let g="";a.status==="pending"&&(g="⏳"),a.status==="accepted"&&(g="✅"),a.status==="rework"&&(g="✏️"),g&&(c.innerHTML=`<span class="version-status-icon">${g}</span> <span>${c.textContent}</span>`),c.onclick=()=>p(a.id,c),c.dataset.id=a.id,i.append(c)});let s=0;e&&(s=t.findIndex(a=>a.id==e),s<0&&(s=0)),l=t[s].id,d&&window.tinymce&&window.tinymce.get("editor")&&(p(l,i.children[s]),l=null)}async function p(t,s,a=0){if(!window.tinymce||!window.tinymce.get("editor")){a<10&&setTimeout(()=>p(t,s,a+1),100);return}document.querySelectorAll(".version-item").forEach(c=>c.classList.remove("active")),s.classList.add("active"),e=t;try{const c=await m(`/practice/${n}/version/${t}`);window.tinymce.get("editor").setContent(c.content||"")}catch(c){alert(c.message)}}document.querySelector(".actions button[onclick]").onclick=async()=>{const t=document.querySelector(".version-item.active");if(!t)return alert("Нет выбранной версии!");const s=t.dataset.id;try{await m(`/practice/${n}/send/${s}`,{method:"POST"}),await r(),alert("Версия отправлена на проверку!")}catch(a){alert(a.message)}},document.getElementById("save-btn").onclick=async()=>{try{let t="";window.tinymce&&window.tinymce.get("editor")?t=window.tinymce.get("editor").getContent():t=document.getElementById("editor").value,await m(`/practice/${n}/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:t})}),await r(),alert("Сохранено!")}catch(t){alert(t.message)}};function h(t){const s=document.getElementById("toc");if(!s)return;const a=t.getContent(),c=document.createElement("div");c.innerHTML=a;const g=c.querySelectorAll("h1, h2, h3, h4");let T='<div class="toc-title">Оглавление</div>';g.length===0?T+='<div style="opacity:.6;">Нет заголовков</div>':g.forEach((y,b)=>{y.id="toc-h-"+b,T+=`<div class="toc-item toc-${y.tagName.toLowerCase()}" data-toc-id="${y.id}">${y.textContent}</div>`}),s.innerHTML=T,s.querySelectorAll(".toc-item").forEach(y=>{y.onclick=function(){const b=this.getAttribute("data-toc-id"),E=t.getDoc();if(E){const $=E.getElementById(b);$&&($.scrollIntoView({behavior:"smooth",block:"center"}),$.classList.add("toc-highlight"),setTimeout(()=>$.classList.remove("toc-highlight"),1200))}}});const I=t.getDoc();I&&I.querySelectorAll("h1, h2, h3, h4").forEach((b,E)=>{b.id="toc-h-"+E})}function v(){const t=document.querySelector(".version-item.active");return t?t.dataset.id:null}const k=C(),w=(k==null?void 0:k.role)==="TEACHER",B=document.querySelector(".actions");w?(B.innerHTML=`
      <button class="btn-accent" id="rework-btn">Правки</button>
      <button class="btn-accent" id="accept-btn">Принять</button>`,document.getElementById("accept-btn").onclick=async()=>{const t=v();if(!t)return alert("Нет версии");await m(`/practice/${n}/version/${t}/accept`,{method:"PUT"}),await r()},document.getElementById("rework-btn").onclick=()=>{const t=v();if(!t)return alert("Нет версии");R("Замечания",async s=>{await m(`/practice/${n}/version/${t}/rework`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({comment:s})}),await r()})}):(document.querySelector(".actions button[onclick]").onclick=async()=>{const t=document.querySelector(".version-item.active");if(!t)return alert("Нет выбранной версии!");const s=t.dataset.id;try{await m(`/practice/${n}/send/${s}`,{method:"POST"}),await r(),alert("Версия отправлена на проверку!")}catch(a){alert(a.message)}},document.getElementById("save-btn").onclick=async()=>{try{let t="";window.tinymce&&window.tinymce.get("editor")?t=window.tinymce.get("editor").getContent():t=document.getElementById("editor").value,await m(`/practice/${n}/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:t})}),await r(),alert("Сохранено!")}catch(t){alert(t.message)}})}function lt(){dt("tech","Технологическая практика")}function dt(n,o){document.querySelector("#app").innerHTML=`
    <main class="container">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:var(--gap-s)">
        ${o}
      </h2>

      <section class="editor-layout">
        <div class="side-pane">
          <aside class="versions-pane" id="versions">
            <p style="opacity:.6;text-align:center;margin-top:var(--gap-s)">
              Нет версий
            </p>
          </aside>
          <nav class="toc-pane" id="toc"></nav>
        </div>
        <div class="editor-pane">
          <textarea id="editor"></textarea>

          <div class="actions">
            <button class="btn-accent" id="save-btn">Сохранить</button>
            <button class="btn-accent" onclick="navigate('/')">На проверку</button>
          </div>
        </div>
      </section>
    </main>
  `;const i=document.getElementById("versions");let r=null,e=null,l=!1;u();function d(t){if(!t.length)return;i.innerHTML="",t.forEach(a=>{const c=document.createElement("div");c.className="version-item",c.textContent=new Date(a.createdAt).toLocaleString();let g="";a.status==="pending"&&(g="⏳"),a.status==="accepted"&&(g="✅"),a.status==="rework"&&(g="✏️"),g&&(c.innerHTML=`<span class="version-status-icon">${g}</span> <span>${c.textContent}</span>`),c.onclick=()=>p(a.id,c),c.dataset.id=a.id,i.append(c)});let s=0;r&&(s=t.findIndex(a=>a.id==r),s<0&&(s=0)),e=t[s].id,l&&window.tinymce&&window.tinymce.get("editor")&&(p(e,i.children[s]),e=null)}window.tinymce&&(window.tinymce.get("editor")&&window.tinymce.get("editor").remove(),window.tinymce.init({selector:"#editor",language:"ru",height:500,menubar:!0,plugins:["lists","link","code","fullscreen","table","wordcount"],toolbar:"undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | code fullscreen | removeformat | help",content_style:"body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }",setup:function(t){t.on("init change SetContent",function(){B(t)}),t.on("init",function(){if(l=!0,e){const a=Array.from(i.children).findIndex(c=>c.dataset.id==e);a>=0&&p(e,i.children[a]),e=null}})}}));async function u(){try{const t=await m(`/practice/${n}/versions`);d(t)}catch(t){console.warn(t.message)}}async function p(t,s,a=0){if(!window.tinymce||!window.tinymce.get("editor")){a<10&&setTimeout(()=>p(t,s,a+1),100);return}document.querySelectorAll(".version-item").forEach(c=>c.classList.remove("active")),s.classList.add("active"),r=t;try{const c=await m(`/practice/${n}/version/${t}`);window.tinymce.get("editor").setContent(c.content||"")}catch(c){alert(c.message)}}function h(){const t=document.querySelector(".version-item.active");return t?t.dataset.id:null}const v=C(),k=(v==null?void 0:v.role)==="TEACHER",w=document.querySelector(".actions");k?(w.innerHTML=`
      <button class="btn-accent" id="rework-btn">Правки</button>
      <button class="btn-accent" id="accept-btn">Принять</button>`,document.getElementById("accept-btn").onclick=async()=>{const t=h();if(!t)return alert("Нет версии");await m(`/practice/${n}/version/${t}/accept`,{method:"PUT"}),await u()},document.getElementById("rework-btn").onclick=()=>{const t=h();if(!t)return alert("Нет версии");R("Замечания",async s=>{await m(`/practice/${n}/version/${t}/rework`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({comment:s})}),await u()})}):(document.querySelector(".actions button[onclick]").onclick=async()=>{const t=document.querySelector(".version-item.active");if(!t)return alert("Нет выбранной версии!");const s=t.dataset.id;try{await m(`/practice/${n}/send/${s}`,{method:"POST"}),await u(),alert("Версия отправлена на проверку!")}catch(a){alert(a.message)}},document.getElementById("save-btn").onclick=async()=>{try{let t="";window.tinymce&&window.tinymce.get("editor")?t=window.tinymce.get("editor").getContent():t=document.getElementById("editor").value,await m(`/practice/${n}/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:t})}),await u(),alert("Сохранено!")}catch(t){alert(t.message)}});function B(t){const s=document.getElementById("toc");if(!s)return;const a=t.getContent(),c=document.createElement("div");c.innerHTML=a;const g=c.querySelectorAll("h1, h2, h3, h4");let T='<div class="toc-title">Оглавление</div>';g.length===0?T+='<div style="opacity:.6;">Нет заголовков</div>':g.forEach((y,b)=>{y.id="toc-h-"+b,T+=`<div class="toc-item toc-${y.tagName.toLowerCase()}" data-toc-id="${y.id}">${y.textContent}</div>`}),s.innerHTML=T,s.querySelectorAll(".toc-item").forEach(y=>{y.onclick=function(){const b=this.getAttribute("data-toc-id"),E=t.getDoc();if(E){const $=E.getElementById(b);$&&($.scrollIntoView({behavior:"smooth",block:"center"}),$.classList.add("toc-highlight"),setTimeout(()=>$.classList.remove("toc-highlight"),1200))}}});const I=t.getDoc();I&&I.querySelectorAll("h1, h2, h3, h4").forEach((b,E)=>{b.id="toc-h-"+E})}}function ut(){mt("pre","Преддипломная практика")}function mt(n,o){document.querySelector("#app").innerHTML=`
    <main class="container">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:var(--gap-s)">
        ${o}
      </h2>

      <section class="editor-layout">
        <div class="side-pane">
          <aside class="versions-pane" id="versions">
            <p style="opacity:.6;text-align:center;margin-top:var(--gap-s)">
              Нет версий
            </p>
          </aside>
          <nav class="toc-pane" id="toc"></nav>
        </div>
        <div class="editor-pane">
          <textarea id="editor"></textarea>

          <div class="actions">
            <button class="btn-accent" id="save-btn">Сохранить</button>
            <button class="btn-accent" onclick="navigate('/')">На проверку</button>
          </div>
        </div>
      </section>
    </main>
  `;const i=document.getElementById("versions");let r=null,e=null,l=!1;u();function d(t){if(!t.length)return;i.innerHTML="",t.forEach(a=>{const c=document.createElement("div");c.className="version-item",c.textContent=new Date(a.createdAt).toLocaleString();let g="";a.status==="pending"&&(g="⏳"),a.status==="accepted"&&(g="✅"),a.status==="rework"&&(g="✏️"),g&&(c.innerHTML=`<span class="version-status-icon">${g}</span> <span>${c.textContent}</span>`),c.onclick=()=>p(a.id,c),c.dataset.id=a.id,i.append(c)});let s=0;r&&(s=t.findIndex(a=>a.id==r),s<0&&(s=0)),e=t[s].id,l&&window.tinymce&&window.tinymce.get("editor")&&(p(e,i.children[s]),e=null)}window.tinymce&&(window.tinymce.get("editor")&&window.tinymce.get("editor").remove(),window.tinymce.init({selector:"#editor",language:"ru",height:500,menubar:!0,plugins:["lists","link","code","fullscreen","table","wordcount"],toolbar:"undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | code fullscreen | removeformat | help",content_style:"body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }",setup:function(t){t.on("init change SetContent",function(){B(t)}),t.on("init",function(){if(l=!0,e){const a=Array.from(i.children).findIndex(c=>c.dataset.id==e);a>=0&&p(e,i.children[a]),e=null}})}}));async function u(){try{const t=await m(`/practice/${n}/versions`);d(t)}catch(t){console.warn(t.message)}}async function p(t,s,a=0){if(!window.tinymce||!window.tinymce.get("editor")){a<10&&setTimeout(()=>p(t,s,a+1),100);return}document.querySelectorAll(".version-item").forEach(c=>c.classList.remove("active")),s.classList.add("active"),r=t;try{const c=await m(`/practice/${n}/version/${t}`);window.tinymce.get("editor").setContent(c.content||"")}catch(c){alert(c.message)}}function h(){const t=document.querySelector(".version-item.active");return t?t.dataset.id:null}const v=C(),k=(v==null?void 0:v.role)==="TEACHER",w=document.querySelector(".actions");k?(w.innerHTML=`
      <button class="btn-accent" id="rework-btn">Правки</button>
      <button class="btn-accent" id="accept-btn">Принять</button>`,document.getElementById("accept-btn").onclick=async()=>{const t=h();if(!t)return alert("Нет версии");await m(`/practice/${n}/version/${t}/accept`,{method:"PUT"}),await u()},document.getElementById("rework-btn").onclick=()=>{const t=h();if(!t)return alert("Нет версии");R("Замечания",async s=>{await m(`/practice/${n}/version/${t}/rework`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({comment:s})}),await u()})}):(document.querySelector(".actions button[onclick]").onclick=async()=>{const t=document.querySelector(".version-item.active");if(!t)return alert("Нет выбранной версии!");const s=t.dataset.id;try{await m(`/practice/${n}/send/${s}`,{method:"POST"}),await u(),alert("Версия отправлена на проверку!")}catch(a){alert(a.message)}},document.getElementById("save-btn").onclick=async()=>{try{let t="";window.tinymce&&window.tinymce.get("editor")?t=window.tinymce.get("editor").getContent():t=document.getElementById("editor").value,await m(`/practice/${n}/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:t})}),await u(),alert("Сохранено!")}catch(t){alert(t.message)}});function B(t){const s=document.getElementById("toc");if(!s)return;const a=t.getContent(),c=document.createElement("div");c.innerHTML=a;const g=c.querySelectorAll("h1, h2, h3, h4");let T='<div class="toc-title">Оглавление</div>';g.length===0?T+='<div style="opacity:.6;">Нет заголовков</div>':g.forEach((y,b)=>{y.id="toc-h-"+b,T+=`<div class="toc-item toc-${y.tagName.toLowerCase()}" data-toc-id="${y.id}">${y.textContent}</div>`}),s.innerHTML=T,s.querySelectorAll(".toc-item").forEach(y=>{y.onclick=function(){const b=this.getAttribute("data-toc-id"),E=t.getDoc();if(E){const $=E.getElementById(b);$&&($.scrollIntoView({behavior:"smooth",block:"center"}),$.classList.add("toc-highlight"),setTimeout(()=>$.classList.remove("toc-highlight"),1200))}}});const I=t.getDoc();I&&I.querySelectorAll("h1, h2, h3, h4").forEach((b,E)=>{b.id="toc-h-"+E})}}async function gt({params:n}){var e;const o=n.sid,i=await m(`/student/${o}`),r=[{key:"project",label:"Проектная практика"},{key:"tech",label:"Технологическая практика"},{key:"pre",label:"Преддипломная практика"}];document.querySelector("#app").innerHTML=`
    <div class="container student-card">
      <section class="card identity">
        <div class="avatar"></div>
        <h2>${((e=i.name)==null?void 0:e.replace(" ","<br>"))||"Неизвестно"}</h2>
        <p>${i.group}</p>
        <button id="chat-btn" class="btn-accent">Чат</button>
      </section>
      <section class="card info">
        <h3 style="text-align:center;margin-bottom:24px">Тема: ${i.topic}</h3>
        <h3 style="text-align:center;margin-bottom:18px">Трекер</h3>
        ${r.map(l=>`
          <p>${l.label}</p>
          <div class="progress"><div style="width:${i.progress[l.key]||0}%"></div></div>
        `).join("")}
        <button id="worksBtn" class="btn-accent" style="width:100%;margin-top:32px">
          Работы
        </button>
      </section>
    </div>`,document.getElementById("chat-btn").onclick=()=>L(`/chat?user=${o}`),document.getElementById("worksBtn").onclick=()=>{O("Задания",`
      <div class="practice-list-modal">
        ${r.map(l=>{const d=i.progress[l.key]||0,u=d===100?"#22c55e":d>0?"#facc15":"#ef4444";return`<button data-type="${l.key}">
                    <span>${l.label}</span>
                    <span class="status-dot" style="background:${u}"></span>
                  </button>`}).join("")}
      </div>`,l=>{l.querySelectorAll("button[data-type]").forEach(d=>d.onclick=()=>{L("/practice/"+d.dataset.type),S()})})}}const H={"/":()=>{var n;return((n=C())==null?void 0:n.role)==="TEACHER"?ct():ot()},"/login":F,"/chat":at,"/practice/project":st,"/practice/tech":lt,"/practice/pre":ut,"/student/:sid":gt};function pt(){window.addEventListener("popstate",()=>j(window.location.pathname)),document.body.addEventListener("click",n=>{const o=n.target.closest("[data-link]");o&&(n.preventDefault(),L(o.getAttribute("href")))}),j(window.location.pathname)}function L(n){n!==window.location.pathname&&(history.pushState(null,"",n),j(n),window.dispatchEvent(new Event("va-update-panel")))}function ft(n){for(const o in H){if(!o.includes(":"))continue;const i=new RegExp("^"+o.replace(/:[^/]+/g,"([^/]+)")+"$"),r=n.match(i);if(r){const e=(o.match(/:[^/]+/g)||[]).map(d=>d.slice(1)),l=Object.fromEntries(e.map((d,u)=>[d,r[u+1]]));return{page:H[o],params:l}}}return null}function j(n){const o=n.split("?")[0];if(H[o])return H[o]();const i=ft(o);if(i)return i.page({params:i.params});F()}localStorage.getItem("lang")||z("ru");ht();pt();function ht(){const n=document.createElement("button");n.id="back-btn",n.className="global-back-btn",n.title="Назад",n.innerHTML="←",document.body.append(n);const o=document.createElement("div");o.className="control-panel",o.innerHTML=`
    <button id="home-btn"   title="На главную">🏠</button>
    <button id="theme-btn"  title="Смена темы">🌓</button>
    <button id="lang-btn"   title="Смена языка"></button>
    <button id="logout-btn" title="Выйти">🚪</button>
  `,document.body.append(o);function i(){const d=location.pathname==="/login";document.getElementById("back-btn").style.display=d?"none":"block",document.getElementById("logout-btn").style.display=d?"none":"inline-block"}i(),window.addEventListener("popstate",i),N(i);const r=document.getElementById("lang-btn"),e=()=>{r.textContent=V()==="ru"?"RU":"EN"};e(),r.onclick=()=>{z(V()==="ru"?"en":"ru")},N(e);const l=document.getElementById("theme-btn");localStorage.getItem("theme")==="dark"&&(document.documentElement.dataset.theme="dark"),l.onclick=()=>{const d=document.documentElement,u=d.dataset.theme==="dark"?"light":"dark";d.dataset.theme=u,localStorage.setItem("theme",u)},document.getElementById("logout-btn").onclick=()=>{nt("Выход из аккаунта","Вы уверены, что хотите выйти из аккаунта?",()=>X())},document.getElementById("home-btn").onclick=()=>L("/"),document.getElementById("back-btn").onclick=()=>history.back()}
