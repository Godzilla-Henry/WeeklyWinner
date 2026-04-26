<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { computed, type Component } from 'vue';
import { LayoutDashboard, Briefcase, ClipboardList, Settings } from 'lucide-vue-next';

interface NavItem {
  label: string;
  to: string;
  icon: Component;
}

const route = useRoute();

const navItems: NavItem[] = [
  { label: '總覽', to: '/', icon: LayoutDashboard },
  { label: '資產', to: '/portfolio', icon: Briefcase },
  { label: '紀錄', to: '/records', icon: ClipboardList },
  { label: '設定', to: '/settings', icon: Settings },
];

const currentPath = computed((): string => route.path);
</script>

<template>
  <div class="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-6">
    <nav class="relative flex items-center gap-1.5 overflow-hidden rounded-pill bg-white/70 px-2.5 py-2 shadow-(--shadow-liquid) backdrop-blur-xl">
      <!-- 流體光斑 -->
      <div class="pointer-events-none absolute -left-4 -top-4 h-20 w-20 rounded-full bg-amber-400/12 blur-2xl" />
      <div class="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-orange-400/10 blur-2xl" />

      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
        :class="currentPath === item.to
          ? 'bg-brand text-brand-foreground shadow-(--shadow-liquid-sm)'
          : 'text-muted-foreground hover:bg-brand-muted hover:text-brand'"
      >
        <component :is="item.icon" :size="20" :stroke-width="1.75" />
      </RouterLink>
    </nav>
  </div>
</template>
