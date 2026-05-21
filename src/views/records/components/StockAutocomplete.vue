<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStockSearch, type StockOption } from '@/composables/module/useStockSearch';

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const { keyword, suggestions } = useStockSearch();

const isOpen = ref(false);

/* 同步外部值 */
watch(
  () => props.modelValue,
  (val) => {
    keyword.value = val;
  },
  { immediate: true },
);

function handleInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  keyword.value = target.value;
  emit('update:modelValue', target.value);
  isOpen.value = true;
}

function handleSelect(option: StockOption): void {
  const display = `${option.name}(${option.symbol})`;
  keyword.value = display;
  emit('update:modelValue', display);
  isOpen.value = false;
}

function handleFocus(): void {
  if (keyword.value.trim().length > 0) {
    isOpen.value = true;
  }
}

function handleBlur(): void {
  /* 延遲關閉，讓 mousedown 事件先觸發 */
  setTimeout(() => {
    isOpen.value = false;
  }, 150);
}
</script>

<template>
  <div class="relative">
    <input
      :value="keyword"
      type="text"
      placeholder="輸入股票名稱或代碼，若選單未出現可自行填寫。"
      autocomplete="off"
      class="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    >

    <!-- 下拉選單 -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="isOpen && suggestions.length > 0"
        class="absolute left-0 top-full z-50 mt-1.5 max-h-48 w-full overflow-auto rounded-xl border border-border bg-white p-1 shadow-(--shadow-card)"
      >
        <button
          v-for="option in suggestions"
          :key="option.symbol"
          type="button"
          class="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition hover:bg-brand-muted"
          @mousedown.prevent="handleSelect(option)"
        >
          <span class="font-medium text-foreground">{{ option.name }}</span>
          <span class="text-xs text-muted-foreground">({{ option.symbol }})</span>
        </button>
      </div>
    </Transition>
  </div>
</template>
