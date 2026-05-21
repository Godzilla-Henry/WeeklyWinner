<script setup lang="ts">
interface Props {
  /** 頁面標題 */
  title?: string;
  /** 頁面副標題 */
  subtitle?: string;
  /** 內容區最大寬度，預設 max-w-4xl */
  wide?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  subtitle: undefined,
  wide: false,
});
</script>

<template>
  <main
    class="mx-auto flex flex-col gap-6 px-8 py-6 sm:px-10"
    :class="props.wide ? 'max-w-5xl' : 'max-w-4xl'"
  >
    <!-- 頁面標題區 -->
    <header v-if="props.title || $slots.header">
      <slot name="header">
        <h2 class="text-lg font-bold text-foreground">
          {{ props.title }}
        </h2>
        <p
          v-if="props.subtitle"
          class="text-sm text-muted-foreground"
        >
          {{ props.subtitle }}
        </p>
      </slot>
    </header>

    <!-- 內容區 — 統一 gap-6 -->
    <div class="flex flex-col gap-6">
      <slot />
    </div>
  </main>
</template>
