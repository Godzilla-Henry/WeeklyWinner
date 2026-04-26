<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <span :class="cn('relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full', props.class)">
    <slot />
  </span>
</template>
