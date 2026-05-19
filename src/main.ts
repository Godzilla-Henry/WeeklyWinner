import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './plugins/pinia';
import { vueQueryPlugin } from './plugins/queryClient';
import { initLiff } from './plugins/liff';
import './assets/styles/index.css';

/* 先建立 App 並安裝 Pinia，讓 initLiff 可使用 Store */
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vueQueryPlugin);

/* LIFF 初始化（含後端登入同步）完成後再掛載 */
initLiff().then(() => {
  app.mount('#app');
});

/* 僅在正式環境（HTTPS）註冊 Service Worker，避免干擾 Vite HMR */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* Service Worker 註冊失敗不影響主功能 */
    });
  });
}
