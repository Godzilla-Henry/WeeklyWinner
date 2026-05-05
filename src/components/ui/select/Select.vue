<script setup lang="ts">
/**
 * 自訂 Select 元件
 * 不使用 reka-ui SelectRoot，避免 aria-hidden 問題
 */
import { provide, ref, watch } from 'vue';
import { SELECT_INJECTION_KEY, type SelectContext } from './context';

interface Props {
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);
const internalValue = ref<string | undefined>(props.modelValue);

/* 同步外部 modelValue */
watch(() => props.modelValue, (val) => {
  internalValue.value = val;
});

const context: SelectContext = {
  modelValue: internalValue,
  isOpen,
  onSelect: (value: string) => {
    emit('update:modelValue', value);
    internalValue.value = value;
    isOpen.value = false;
  },
  toggle: () => {
    isOpen.value = !isOpen.value;
  },
  close: () => {
    isOpen.value = false;
  },
};

provide(SELECT_INJECTION_KEY, context);
</script>

<template>
  <div class="relative inline-block" data-select-root>
    <slot />
  </div>
</template>
