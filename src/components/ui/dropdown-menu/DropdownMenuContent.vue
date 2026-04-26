<script setup lang="ts">
import { cn } from '@/lib/utils';
import { DropdownMenuContent as ContentPrimitive, DropdownMenuPortal, type DropdownMenuContentProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = withDefaults(defineProps<DropdownMenuContentProps & {
  class?: HTMLAttributes['class'];
}>(), {
  sideOffset: 8,
  align: 'end',
});

const delegatedProps = computed(() => {
  const { class: _, ...rest } = props;
  return rest;
});
</script>

<template>
  <DropdownMenuPortal>
    <ContentPrimitive
      v-bind="delegatedProps"
      :class="cn(
        'noise-overlay z-50 min-w-48 overflow-clip rounded-2xl bg-white p-1.5 shadow-(--shadow-float) data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        props.class,
      )"
    >
      <!-- 流體光斑 -->
      <div class="glow-orb pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-400/8 blur-xl" />

      <div class="relative">
        <slot />
      </div>
    </ContentPrimitive>
  </DropdownMenuPortal>
</template>
