const dict = {
  ru: () => import('./ru.json' /* @vite-ignore */),
  en: () => import('./en.json' /* @vite-ignore */),
};
let lang = localStorage.getItem('lang') || 'ru';
const cache = {}, listeners = new Set();

export function setLang(l){
  if (!(l in dict) || l === lang) return;
  lang = l; localStorage.setItem('lang', l);
  listeners.forEach(cb=>cb(lang));
}
export const getLang = () => lang;

export function onLangChange(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }

export async function t(key){
  if (!cache[lang]) cache[lang] = await dict[lang]().then(m=>m.default);
  return cache[lang][key] ?? key;
}
