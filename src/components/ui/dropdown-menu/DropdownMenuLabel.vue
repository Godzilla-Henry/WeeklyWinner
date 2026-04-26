<script setup lang="ts">
import { cn } from '@/lib/utils';
import { DropdownMenuLabel as LabelPrimitive } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <LabelPrimitive :class="cn('px-3 py-2 text-xs font-medium text-muted-foreground', props.class)">
    <slot />
  </LabelPrimitive>
</template>
