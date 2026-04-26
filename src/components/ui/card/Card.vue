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
      'relative overflow-hidden rounded-liquid bg-white text-card-foreground shadow-(--shadow-card) transition-all duration-300 hover:shadow-(--shadow-card-hover)',
      props.class,
    )"
    v-bind="delegatedProps"
  >
    <!-- 流體光斑裝飾 -->
    <div class="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-amber-400/8 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-orange-400/12 blur-3xl" />
    <div class="pointer-events-none absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-orange-300/8 blur-2xl" />

    <div class="relative">
      <slot />
    </div>
  </div>
</template>
