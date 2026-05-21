<script setup lang="ts">
import { Construction } from 'lucide-vue-next';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';

interface Props {
  title: string;
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '此功能正在開發中，敬請期待',
});
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col items-center justify-center gap-4 py-24">
      <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-muted">
        <Construction
          :size="28"
          :stroke-width="1.5"
          class="text-brand"
        />
      </div>
      <div class="text-center">
        <h2 class="text-lg font-bold text-foreground">
          {{ props.title }}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ props.subtitle }}
        </p>
      </div>
      <span class="rounded-pill bg-brand-muted px-4 py-1.5 text-xs font-medium text-brand">
        Coming Soon
      </span>
    </div>
  </DefaultLayout>
</template>
