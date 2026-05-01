/**
 * TanStack Vue Query 插件
 */

import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import type { VueQueryPluginOptions } from '@tanstack/vue-query';
import type { Plugin } from 'vue';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** 5 分鐘內不重新請求 */
      staleTime: 5 * 60 * 1000,
      /** 快取保留 10 分鐘 */
      gcTime: 10 * 60 * 1000,
      /** 失敗重試 1 次 */
      retry: 1,
      /** 視窗聚焦時不自動重新請求 */
      refetchOnWindowFocus: false,
    },
  },
});

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
};

export const vueQueryPlugin: Plugin = {
  install(app) {
    app.use(VueQueryPlugin, vueQueryPluginOptions);
  },
};

export { queryClient };
