<script setup lang="ts">
import { cn } from '@/lib/utils';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const delegatedProps = computed(() => {
  const { class: _, ...rest } = props;
  return rest;
});
</script>

<template>
  <div
    :class="cn(
      'noise-overlay relative overflow-clip rounded-liquid bg-white text-card-foreground shadow-(--shadow-card) transition-all duration-300 hover:shadow-(--shadow-card-hover)',
      props.class,
    )"
    v-bind="delegatedProps"
  >
    <!-- 流體光斑 — GPU 合成層 + 內縮避免裁切硬邊 -->
    <div class="glow-orb pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-amber-400/8 blur-2xl" />
    <div class="glow-orb pointer-events-none absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-orange-400/6 blur-2xl" />

    <div class="relative">
      <slot />
    </div>
  </div>
</template>
