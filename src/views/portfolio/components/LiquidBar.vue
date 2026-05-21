<script setup lang="ts">
/** 流體比例長條圖 — 極度圓潤的膠囊造型 */

interface BarSegment {
  symbol: string;
  name: string;
  weight: number;
  color: string;
}

interface Props {
  segments: BarSegment[];
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <!-- 膠囊長條 -->
    <div class="flex h-5 overflow-hidden rounded-pill bg-brand-muted shadow-inner">
      <div
        v-for="(seg, i) in props.segments"
        :key="seg.symbol"
        :class="seg.color"
        :style="{ width: `${seg.weight}%` }"
        class="transition-all duration-700 ease-out first:rounded-l-pill last:rounded-r-pill"
      />
    </div>

    <!-- 圖例標籤 — 膠囊 Tags -->
    <div class="mt-4 flex flex-wrap gap-2">
      <div
        v-for="seg in props.segments"
        :key="seg.symbol"
        class="flex items-center gap-1.5 rounded-pill bg-brand-muted px-3 py-1 text-xs font-medium text-foreground transition-all duration-300 hover:bg-brand/10 hover:scale-105"
      >
        <span
          :class="seg.color"
          class="inline-block h-2 w-2 rounded-full shadow-sm"
        />
        <span>{{ seg.name }}</span>
        <span class="text-muted-foreground">{{ seg.weight }}%</span>
      </div>
    </div>
  </div>
</template>
