<script setup lang="ts">
import { inject, computed, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-vue-next';
import { SELECT_INJECTION_KEY, type SelectContext } from './context';

interface Props {
  value: string;
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();

const context = inject<SelectContext>(SELECT_INJECTION_KEY)!;

const isSelected = computed((): boolean => context.modelValue.value === props.value);

function handleSelect(): void {
  context.onSelect(props.value);
}
</script>

<template>
  <button
    type="button"
    :class="cn(
      'relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-2 pr-8 text-left text-sm outline-none transition hover:bg-brand-muted',
      isSelected && 'bg-brand-muted font-medium',
      $props.class,
    )"
    @click="handleSelect"
  >
    <slot />
    <span v-if="isSelected" class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check :size="12" :stroke-width="2.5" class="text-brand" />
    </span>
  </button>
</template>
