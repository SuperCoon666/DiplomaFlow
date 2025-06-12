const base = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '';

export async function request(path, opts = {}) {
  const clean = path.startsWith('/api') ? path.slice(4) : path;
  const res   = await fetch(base + '/api' + clean, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? null : res.json();
}
