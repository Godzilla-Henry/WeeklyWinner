<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bell, LogIn, LogOut, User, Settings, FileText } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useLiff } from '@/composables/useLiff';
import { useUnreadCountsQuery, useReadStatusQuery } from '@/composables/module/useUnreadQuery';
import { useReportsQuery } from '@/composables/module/useReportQuery';
import { useRouter } from 'vue-router';

const router = useRouter();
const { profile, loggedIn, initialized, login, logout } = useLiff();

/* ── 未讀數量（全域 Badge） ── */
const { data: unreadData } = useUnreadCountsQuery();
const unreadTotal = computed((): number => unreadData.value?.counts?.total ?? 0);
const unreadDisplay = computed((): string => {
  if (unreadTotal.value > 99) return '99+';
  return String(unreadTotal.value);
});

/* ── 週報列表 + 已讀狀態（通知下拉用） ── */
const page = ref(1);
const { data: reportsData } = useReportsQuery(page);
const { data: readStatusData } = useReadStatusQuery('weekly_report');
const readIds = computed((): string[] => readStatusData.value?.readIds ?? []);

/** 通知列表項目 */
const notificationItems = computed(() => {
  const reports = reportsData.value?.reports ?? [];
  return reports.map((r) => ({
    id: r.id,
    title: r.title,
    date: r.date,
    isUnread: !readIds.value.includes(r.id),
  }));
});

const initials = computed((): string => {
  if (!profile.value) return 'WW';
  return profile.value.displayName.slice(0, 2);
});

function handleLogout(): void {
  logout();
}

function navigateToSettings(): void {
  void router.push({ name: 'settings' });
}

function navigateToReport(reportId: string): void {
  void router.push({ name: 'weekly-report', params: { id: reportId } });
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
          class="h-12"
        />
      </div>

      <!-- 功能區 -->
      <div class="flex items-center gap-2">
        <template v-if="loggedIn">
          <!-- 通知鈴鐺 + 下拉列表 -->
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button
                class="relative flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-(--shadow-soft) transition-all duration-300 hover:shadow-(--shadow-card) hover:text-foreground"
                aria-label="通知"
              >
                <Bell :size="18" :stroke-width="1.75" />
                <span
                  v-if="unreadTotal > 0"
                  class="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground ring-2 ring-background"
                >
                  {{ unreadDisplay }}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-72" align="end">
              <DropdownMenuLabel>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold">通知</span>
                  <span v-if="unreadTotal > 0" class="text-xs text-brand font-medium">
                    {{ unreadTotal }} 則未讀
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <!-- 通知列表 -->
              <template v-if="notificationItems.length">
                <DropdownMenuItem
                  v-for="item in notificationItems"
                  :key="item.id"
                  class="flex items-start gap-3 px-3 py-2.5"
                  @select="navigateToReport(item.id)"
                >
                  <div class="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" :class="item.isUnread ? 'bg-brand-muted' : 'bg-muted'">
                    <FileText :size="14" :stroke-width="1.75" :class="item.isUnread ? 'text-brand' : 'text-muted-foreground'" />
                    <!-- 未讀紅點 -->
                    <span
                      v-if="item.isUnread"
                      class="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gain ring-1 ring-card"
                    />
                  </div>
                  <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span class="truncate text-sm" :class="item.isUnread ? 'font-semibold text-foreground' : 'text-muted-foreground'">
                      {{ item.title }}
                    </span>
                    <span class="text-[11px] text-muted-foreground/70">{{ item.date }}</span>
                  </div>
                </DropdownMenuItem>
              </template>

              <!-- 空狀態 -->
              <div v-else class="flex items-center justify-center px-4 py-6">
                <p class="text-xs text-muted-foreground">暫無通知</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- 使用者頭像 + 下拉選單 -->
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar class="h-10 w-10 cursor-pointer rounded-full shadow-(--shadow-soft) ring-0 transition-all duration-300 hover:shadow-(--shadow-card)">
                <AvatarImage
                  v-if="profile?.pictureUrl"
                  :src="profile.pictureUrl"
                  :alt="profile.displayName"
                  class="rounded-full"
                />
                <AvatarFallback class="rounded-full bg-brand/10 text-xs font-bold text-brand">
                  {{ initials }}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <!-- 使用者資訊 -->
              <DropdownMenuLabel>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-foreground">{{ profile?.displayName ?? '使用者' }}</span>
                  <span v-if="profile?.statusMessage" class="text-xs text-muted-foreground">{{ profile.statusMessage }}</span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <!-- 個人設定 -->
              <DropdownMenuItem @select="navigateToSettings">
                <Settings :size="16" :stroke-width="1.75" />
                <span>個人設定</span>
              </DropdownMenuItem>

              <!-- 個人資料 -->
              <DropdownMenuItem>
                <User :size="16" :stroke-width="1.75" />
                <span>個人資料</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <!-- 登出 -->
              <DropdownMenuItem :destructive="true" @select="handleLogout">
                <LogOut :size="16" :stroke-width="1.75" />
                <span>登出</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>

        <!-- 未登入 — LINE 登入按鈕 -->
        <button
          v-else-if="initialized"
          class="flex items-center gap-1.5 rounded-full bg-[#06C755] px-4 py-2 text-sm font-medium text-white shadow-(--shadow-soft) transition-all duration-300 hover:brightness-110 hover:shadow-(--shadow-card)"
          @click="login"
        >
          <LogIn :size="16" :stroke-width="2" />
          <span>LINE 登入</span>
        </button>
      </div>
    </div>
  </header>
</template>
