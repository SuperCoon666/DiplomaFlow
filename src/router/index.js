import showLogin          from '@/pages/login.js';
import showStudent        from '@/pages/dashboard-student.js';
import showTeacher        from '@/pages/dashboard-teacher.js';
import showAdmin          from '@/pages/dashboard-admin.js';
import showChat           from '@/pages/chat.js';
import showTracker        from '@/pages/tracker.js';
import showPracticeProj   from '@/pages/practice-project.js';
import showPracticeTech   from '@/pages/practice-tech.js';
import showPracticePre    from '@/pages/practice-pre.js';
import showNotifications  from '@/pages/notifications.js';
import showDeadlines      from '@/pages/deadlines.js';
import { getUser }        from '@/store';

/* статичные маршруты */
const routes = {
  '/login'            : showLogin,
  '/chat'             : showChat,
  '/tracker'          : showTracker,
  '/practice/project' : showPracticeProj,
  '/practice/tech'    : showPracticeTech,
  '/practice/pre'     : showPracticePre,
  '/notifications'    : showNotifications,
  '/deadlines'        : showDeadlines
};

/* role-specific dashboards */
const dashByRole = {
  student : showStudent,
  teacher : showTeacher,
  admin   : showAdmin
};

export function initRouter(){
  window.addEventListener('popstate',resolve);
  document.body.addEventListener('click',(e)=>{
    const link=e.target.closest('a[data-link]');
    if(link){e.preventDefault();navigate(link.getAttribute('href'));}
  });
  resolve();
}

export function navigate(url){
  history.pushState({},'',url);resolve();
}

function resolve(){
  const { pathname } = location;
  const user = getUser();

  /* сначала проверяем статичные пути */
  if(routes[pathname]){ routes[pathname](); return; }

  /* если не залогинен → на /login */
  if(!user){ navigate('/login'); return; }

  /* иначе выводим dashboard по роли */
  (dashByRole[user.role]??showStudent)();
}
