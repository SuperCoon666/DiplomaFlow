import { TinyEmitter } from 'tiny-emitter';
const emitter = new TinyEmitter();
const cache = {};

let current = 'ru';

export async function t(key) {
  if (!cache[current]) {
    cache[current] = await import(`./${current}.json`);
  }
  return cache[current].default[key] ?? key;
}

export function changeLang(lang) {
  current = lang;
  emitter.emit('lang-changed', lang);
}

export function onLangChange(cb) {
  emitter.on('lang-changed', cb);
}
