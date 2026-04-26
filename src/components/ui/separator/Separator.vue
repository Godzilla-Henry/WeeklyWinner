<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Separator as SeparatorPrimitive } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class'];
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}>(), {
  orientation: 'horizontal',
  decorative: true,
});
</script>

<template>
  <SeparatorPrimitive
    :class="cn(
      'shrink-0 bg-border',
      props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      props.class,
    )"
    :orientation="props.orientation"
    :decorative="props.decorative"
  />
</template>
