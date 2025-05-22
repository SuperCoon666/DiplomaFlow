import { t } from '@/i18n';

export default async function showDashboard() {
  document.querySelector('#app').innerHTML = `
    <h1 style="text-align:center">${await t('dashboard.hello') ?? 'Здравствуйте!'}</h1>
  `;
}
