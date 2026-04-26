<script setup lang="ts">
import { computed } from 'vue';
import { Bell } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLiff } from '@/composables/useLiff';

interface Props {
  unreadCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  unreadCount: 3,
});

const { profile, loggedIn, login } = useLiff();

/** 取得使用者名稱縮寫 */
const initials = computed((): string => {
  if (!profile.value) return 'WW';
  return profile.value.displayName.slice(0, 2);
});

function handleAvatarClick(): void {
  if (!loggedIn.value) {
    login();
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-background/70 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-4xl items-center justify-between px-8 sm:px-10">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <img
          src="@/assets/img/logo.svg"
          alt="Weekly Winner"
          class="h-10"
        />
      </div>

      <!-- 功能區 -->
      <div class="flex items-center gap-2">
        <!-- 通知鈴鐺 -->
        <button
          class="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-muted-foreground shadow-(--shadow-soft) transition-all duration-300 hover:shadow-(--shadow-card) hover:text-foreground"
          aria-label="通知"
        >
          <Bell :size="18" :stroke-width="1.75" />
          <span
            v-if="props.unreadCount > 0"
            class="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground ring-2 ring-background"
          >
            {{ props.unreadCount > 9 ? '9+' : props.unreadCount }}
          </span>
        </button>

        <!-- 使用者頭像 — LIFF 整合 -->
        <Avatar
          class="h-10 w-10 cursor-pointer rounded-2xl shadow-(--shadow-soft) ring-0 transition-all duration-300 hover:shadow-(--shadow-card)"
          @click="handleAvatarClick"
        >
          <AvatarImage
            v-if="profile?.pictureUrl"
            :src="profile.pictureUrl"
            :alt="profile.displayName"
            class="rounded-2xl"
          />
          <AvatarFallback class="rounded-2xl bg-brand/10 text-xs font-bold text-brand">
            {{ initials }}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  </header>
</template>
