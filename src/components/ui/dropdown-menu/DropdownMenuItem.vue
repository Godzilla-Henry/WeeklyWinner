<script setup lang="ts">
import { cn } from '@/lib/utils';
import { DropdownMenuItem as ItemPrimitive, type DropdownMenuItemProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<DropdownMenuItemProps & {
  class?: HTMLAttributes['class'];
  destructive?: boolean;
}>();

const delegatedProps = computed(() => {
  const { class: _, destructive: __, ...rest } = props;
  return rest;
});
</script>

<template>
  <ItemPrimitive
    v-bind="delegatedProps"
    :class="cn(
      'flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50',
      props.destructive
        ? 'text-loss focus:bg-loss/8'
        : 'text-foreground focus:bg-accent',
      props.class,
    )"
  >
    <slot />
  </ItemPrimitive>
</template>
