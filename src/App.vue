<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from '@/components/layout/TheHeader.vue';
import AppNav from '@/components/layout/AppNav.vue';
import PwaInstallButton from '@/components/pwa/PwaInstallButton.vue';

/** App 掛載後淡出 Splash Screen */
onMounted(() => {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('hidden');
    /* 動畫結束後移除 DOM */
    setTimeout(() => splash.remove(), 500);
  }
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground pb-24">
    <TheHeader />
    <RouterView />
    <AppNav />
    <PwaInstallButton />
  </div>
</template>
