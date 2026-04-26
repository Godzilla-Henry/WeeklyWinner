import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

/* 啟用持久化插件 */
pinia.use(piniaPluginPersistedstate);

export default pinia;
