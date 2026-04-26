<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheHeader from '@/components/layout/TheHeader.vue';
import AppNav from '@/components/layout/AppNav.vue';
</script>

<template>
  <div class="min-h-screen bg-background text-foreground pb-24">
    <TheHeader />
    <RouterView />
    <AppNav />
  </div>
</template>
