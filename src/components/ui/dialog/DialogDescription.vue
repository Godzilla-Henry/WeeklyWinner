<script setup lang="ts">
import { cn } from '@/lib/utils';
import { DialogDescription as DialogDescriptionPrimitive } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <DialogDescriptionPrimitive :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </DialogDescriptionPrimitive>
</template>
