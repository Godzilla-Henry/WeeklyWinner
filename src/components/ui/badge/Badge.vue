<script setup lang="ts">
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  variant?: NonNullable<BadgeVariants['variant']>;
}>();

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        gain: 'border-transparent bg-gain/10 text-gain font-semibold',
        loss: 'border-transparent bg-loss/10 text-loss font-semibold',
        brand: 'border-transparent bg-brand-muted text-brand font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

</script>

<template>
  <div :class="cn(badgeVariants({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
