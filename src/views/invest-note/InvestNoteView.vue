<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-vue-next';
import { useInvestNoteDetailQuery } from '@/composables/module/useInvestNoteQuery';
import { useMarkAsReadMutation } from '@/composables/module/useUnreadQuery';
import { useIsLiffLoggedIn } from '@/composables/shared/useLiffToken';
import { noteCategoryLabel } from '@/types/module/dashboard';
import type { NoteCategory } from '@/types/api';

const route = useRoute();
const router = useRouter();

const noteId = computed((): string => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] ?? '' : id;
});

/* ── 記事詳情 API ── */
const { data, isLoading, error } = useInvestNoteDetailQuery(noteId);
const note = computed(() => data.value?.note);

/* ── 自動標記已讀 ── */
const isLoggedIn = useIsLiffLoggedIn();
const { mutate: markRead } = useMarkAsReadMutation();

watch(
  () => data.value?.ok,
  (ok) => {
    if (ok && noteId.value && isLoggedIn.value) {
      markRead({ contentType: 'invest_note', contentId: noteId.value });
    }
  },
);

const categoryBadgeClass: Record<NoteCategory, string> = {
  direction: 'bg-blue-500/10 text-blue-600',
  note: 'bg-emerald-500/10 text-emerald-600',
  event: 'bg-amber-500/10 text-amber-600',
};

/** 將 \n 分段 */
const paragraphs = computed((): string[] => {
  if (!note.value) return [];
  return note.value.content.split('\n').filter((l) => l.trim());
});

function goBack(): void {
  void router.push({ name: 'dashboard', query: { tab: 'notes' } });
}
</script>

<template>
  <DefaultLayout :wide="true">
    <template #header>
      <nav class="flex items-center">
        <button
          class="-ml-2 flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          @click="goBack"
        >
          <ArrowLeft :size="15" :stroke-width="2" />
          <span>總覽</span>
        </button>
      </nav>

      <!-- 標題骨架 -->
      <div v-if="isLoading" class="mt-3 flex flex-col gap-2">
        <Skeleton class="h-6 w-48" />
        <Skeleton class="h-4 w-24" />
      </div>

      <template v-else-if="note">
        <div class="mt-3">
          <h2 class="text-lg font-bold text-foreground">{{ note.title }}</h2>
          <div class="mt-1 flex items-center gap-2">
            <Badge :class="categoryBadgeClass[note.category]">
              {{ noteCategoryLabel[note.category] }}
            </Badge>
            <p class="text-sm text-muted-foreground">{{ note.publishDate }}</p>
          </div>
        </div>
      </template>
    </template>

    <!-- 載入中骨架 -->
    <template v-if="isLoading">
      <Card>
        <CardContent class="flex flex-col gap-4 p-6">
          <Skeleton class="h-5 w-full" />
          <Skeleton class="h-5 w-4/5" />
          <Skeleton class="h-48 w-full rounded-xl" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-3/4" />
        </CardContent>
      </Card>
    </template>

    <!-- 錯誤狀態 -->
    <Card v-else-if="error">
      <CardContent class="flex flex-col items-center justify-center gap-4 p-12">
        <p class="text-lg font-medium text-muted-foreground">載入失敗</p>
        <p class="text-sm text-muted-foreground">{{ error.message }}</p>
        <button class="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90" @click="goBack">
          返回總覽
        </button>
      </CardContent>
    </Card>

    <!-- 記事內容 -->
    <template v-else-if="note">
      <Card>
        <CardContent class="flex flex-col gap-4 p-6">
          <p class="text-base font-medium leading-relaxed text-foreground">
            {{ paragraphs[0] }}
          </p>

          <!-- 封面圖 -->
          <div v-if="note.imageUrl" class="overflow-hidden rounded-xl">
            <img :src="note.imageUrl" :alt="note.title" class="h-48 w-full object-cover sm:h-64" />
          </div>

          <p v-for="(paragraph, idx) in paragraphs.slice(1)" :key="idx" class="text-sm leading-7 text-muted-foreground">
            {{ paragraph }}
          </p>
        </CardContent>
      </Card>
    </template>

    <!-- 找不到記事 -->
    <Card v-else>
      <CardContent class="flex flex-col items-center justify-center gap-4 p-12">
        <p class="text-lg font-medium text-muted-foreground">找不到此記事</p>
        <button class="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90" @click="goBack">
          返回總覽
        </button>
      </CardContent>
    </Card>
  </DefaultLayout>
</template>
