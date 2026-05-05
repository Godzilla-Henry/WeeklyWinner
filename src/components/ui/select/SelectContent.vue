<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { SELECT_INJECTION_KEY, type SelectContext } from './context';

defineProps<{
  class?: HTMLAttributes['class'];
}>();

const context = inject<SelectContext>(SELECT_INJECTION_KEY)!;

/** 點擊外部關閉 */
function handleClickOutside(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-select-root]')) {
    context.close();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true);
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="scale-95 opacity-0"
    enter-to-class="scale-100 opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="scale-100 opacity-100"
    leave-to-class="scale-95 opacity-0"
  >
    <div
      v-show="context.isOpen.value"
      :class="cn(
        'absolute left-0 top-full z-50 mt-1.5 space-y-1 max-h-60 w-full min-w-32 overflow-auto rounded-xl border border-border bg-white p-1 shadow-(--shadow-card)',
        $props.class,
      )"
    >
      <slot />
    </div>
  </Transition>
</template>
