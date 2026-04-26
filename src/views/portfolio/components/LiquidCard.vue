<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div
    :class="cn(
      'relative overflow-hidden rounded-liquid bg-white p-6 text-foreground shadow-(--shadow-liquid) transition-all duration-500 hover:shadow-(--shadow-liquid-hover) hover:scale-[1.02]',
      props.class,
    )"
  >
    <!-- 流體光斑裝飾 — 橘色暈染在白底上 -->
    <div class="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-amber-400/15 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-orange-400/10 blur-3xl" />
    <div class="pointer-events-none absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-orange-300/8 blur-2xl" />

    <div class="relative">
      <slot />
    </div>
  </div>
</template>
