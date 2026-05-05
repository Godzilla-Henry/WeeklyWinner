<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-vue-next';
import { SELECT_INJECTION_KEY, type SelectContext } from './context';

defineProps<{
  class?: HTMLAttributes['class'];
}>();

const context = inject<SelectContext>(SELECT_INJECTION_KEY)!;
</script>

<template>
  <button
    type="button"
    :class="cn(
      'flex h-9.5 w-full items-center justify-between gap-2 rounded-lg border border-border bg-white p-2 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-50',
      $props.class,
    )"
    @click="context.toggle()"
  >
    <span class="truncate">
      <slot />
    </span>
    <ChevronDown
      :size="14"
      :stroke-width="2"
      class="shrink-0 text-muted-foreground transition-transform"
      :class="context.isOpen.value ? 'rotate-180' : ''"
    />
  </button>
</template>
