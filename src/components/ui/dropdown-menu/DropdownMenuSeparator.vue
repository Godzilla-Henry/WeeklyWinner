<script setup lang="ts">
import { cn } from '@/lib/utils';
import { DropdownMenuSeparator as SeparatorPrimitive } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <SeparatorPrimitive :class="cn('-mx-1 my-1 h-px bg-border', props.class)" />
</template>
