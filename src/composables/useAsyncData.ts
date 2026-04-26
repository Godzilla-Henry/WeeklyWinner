import { ref, type Ref } from 'vue';

/** useAsyncData 回傳型別 */
interface UseAsyncDataReturn<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: () => Promise<void>;
}

/**
 * 通用非同步資料載入 Composable
 * @param fetcher - 非同步取得資料的函式
 */
export function useAsyncData<T>(fetcher: () => Promise<T>): UseAsyncDataReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function execute(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fetcher();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, error, execute };
}
