<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  src: string;
  alt?: string;
}>();
</script>

<template>
  <img
    :src="props.src"
    :alt="props.alt ?? ''"
    :class="cn('aspect-square h-full w-full object-cover', props.class)"
  />
</template>
