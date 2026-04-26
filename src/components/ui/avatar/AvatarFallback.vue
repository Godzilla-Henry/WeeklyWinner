<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <span :class="cn('flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground', props.class)">
    <slot />
  </span>
</template>
