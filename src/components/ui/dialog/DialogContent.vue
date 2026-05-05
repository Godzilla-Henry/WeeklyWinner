<script setup lang="ts">
import { cn } from '@/lib/utils';
import {
  DialogContent as DialogContentPrimitive,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  type DialogContentEmits,
  type DialogContentProps,
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<DialogContentProps & {
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...rest } = props;
  return rest;
});
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogContentPrimitive
      v-bind="delegatedProps"
      :class="cn(
        'noise-overlay fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-clip rounded-liquid bg-white shadow-(--shadow-float) duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        props.class,
      )"
      @escape-key-down="emits('escapeKeyDown', $event)"
      @pointer-down-outside="emits('pointerDownOutside', $event)"
      @interact-outside="emits('interactOutside', $event)"
    >
      <!-- 流體光斑 — GPU 合成層 -->
      <div class="glow-orb pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber-400/8 blur-2xl" />
      <div class="glow-orb pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-orange-400/6 blur-2xl" />

      <div class="relative">
        <slot />
      </div>

      <DialogClose
        class="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <X :size="16" />
      </DialogClose>
    </DialogContentPrimitive>
  </DialogPortal>
</template>
