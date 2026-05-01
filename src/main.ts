import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './plugins/pinia';
import { vueQueryPlugin } from './plugins/queryClient';
import { initLiff } from './plugins/liff';
import './assets/styles/index.css';

/* LIFF 初始化完成後再掛載 App */
initLiff().then(() => {
  const app = createApp(App);

  app.use(pinia);
  app.use(router);
  app.use(vueQueryPlugin);
  app.mount('#app');
});
