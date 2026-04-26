<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { computed, type Component } from 'vue';
import { LayoutDashboard, Briefcase, ClipboardList, Settings } from 'lucide-vue-next';

interface NavItem {
  label: string;
  to: string;
  icon: Component;
  disabled?: boolean;
}

const route = useRoute();

const navItems: NavItem[] = [
  { label: '總覽', to: '/', icon: LayoutDashboard },
  { label: '資產', to: '/portfolio', icon: Briefcase, disabled: true },
  { label: '紀錄', to: '/records', icon: ClipboardList, disabled: true },
  { label: '設定', to: '/settings', icon: Settings },
];

const currentPath = computed((): string => route.path);
</script>

<template>
  <div class="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-6">
    <nav class="relative flex items-center gap-1.5 overflow-clip rounded-pill bg-white/70 px-2.5 py-2 shadow-(--shadow-liquid) backdrop-blur-xl">
      <!-- 流體光斑 -->
      <div class="glow-orb pointer-events-none absolute -left-2 -top-2 h-16 w-16 rounded-full bg-amber-400/10 blur-xl" />
      <div class="glow-orb pointer-events-none absolute -bottom-2 -right-2 h-14 w-14 rounded-full bg-orange-400/8 blur-xl" />

      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
        :class="[
          item.disabled
            ? 'pointer-events-none opacity-30'
            : currentPath === item.to
              ? 'bg-brand text-brand-foreground shadow-(--shadow-liquid-sm)'
              : 'text-muted-foreground hover:bg-brand-muted hover:text-brand',
        ]"
        :tabindex="item.disabled ? -1 : 0"
        :aria-disabled="item.disabled"
      >
        <component :is="item.icon" :size="20" :stroke-width="1.75" />
      </RouterLink>
    </nav>
  </div>
</template>
