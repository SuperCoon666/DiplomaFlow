export function toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') ?? 'light';
    root.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
  }
  