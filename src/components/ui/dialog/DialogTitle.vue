<script setup lang="ts">
import { cn } from '@/lib/utils';
import { DialogTitle as DialogTitlePrimitive } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <DialogTitlePrimitive :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)">
    <slot />
  </DialogTitlePrimitive>
</template>
