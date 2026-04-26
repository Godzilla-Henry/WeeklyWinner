<script setup lang="ts">
import { cn } from '@/lib/utils';
import { TabsTrigger as TabsTriggerPrimitive, type TabsTriggerProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<TabsTriggerProps & {
  class?: HTMLAttributes['class'];
}>();

const delegatedProps = computed(() => {
  const { class: _, ...rest } = props;
  return rest;
});
</script>

<template>
  <TabsTriggerPrimitive
    v-bind="delegatedProps"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
      props.class,
    )"
  >
    <slot />
  </TabsTriggerPrimitive>
</template>
