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
      'noise-overlay relative overflow-clip rounded-liquid bg-white p-6 text-foreground shadow-(--shadow-liquid) transition-all duration-500 hover:shadow-(--shadow-liquid-hover) hover:scale-[1.02]',
      props.class,
    )"
  >
    <!-- 流體光斑 — GPU 合成層 + 內縮 + 降低 blur 強度 -->
    <div class="glow-orb pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-amber-400/12 blur-2xl" />
    <div class="glow-orb pointer-events-none absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-orange-400/8 blur-2xl" />
    <div class="glow-orb pointer-events-none absolute right-1/4 top-1/2 h-20 w-20 rounded-full bg-orange-300/6 blur-xl" />

    <div class="relative">
      <slot />
    </div>
  </div>
</template>
