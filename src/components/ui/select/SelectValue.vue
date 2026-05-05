<script setup lang="ts">
/**
 * SelectValue — 顯示目前選中的值
 * 由父層透過 slot 傳入顯示內容
 */
defineProps<{
  placeholder?: string;
}>();
</script>

<template>
  <slot>
    <span v-if="placeholder" class="text-muted-foreground">{{ placeholder }}</span>
  </slot>
</template>
