<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Compass, BookOpen, Zap, ChevronRight } from 'lucide-vue-next';
import { getNoteById, getRelatedNotes, noteCategoryLabel } from './types';
import type { NoteCategory } from './types';
import type { Component } from 'vue';

const route = useRoute();
const router = useRouter();

const noteId = computed((): string => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] ?? '' : id;
});

const note = computed(() => getNoteById(noteId.value));
const relatedNotes = computed(() => getRelatedNotes(noteId.value));

const categoryIcon: Record<NoteCategory, Component> = {
  direction: Compass,
  note: BookOpen,
  event: Zap,
};

const categoryVariant: Record<NoteCategory, 'brand' | 'gain' | 'secondary'> = {
  direction: 'brand',
  note: 'gain',
  event: 'secondary',
};

const iconBg: Record<NoteCategory, string> = {
  direction: 'bg-brand-muted',
  note: 'bg-gain/8',
  event: 'bg-chart-3/8',
};

const iconColor: Record<NoteCategory, string> = {
  direction: 'text-brand',
  note: 'text-gain',
  event: 'text-chart-3',
};

/** 將 \n 分段 */
const paragraphs = computed((): string[] => {
  if (!note.value) return [];
  return note.value.content.split('\n').filter((l) => l.trim());
});

function goBack(): void {
  void router.push({ name: 'dashboard', query: { tab: 'notes' } });
}

function navigateToNote(id: string): void {
  void router.push({ name: 'invest-note', params: { id } });
}
</script>

<template>
  <DefaultLayout :wide="true">
    <template #header>
      <!-- 返回列 — 與 WeeklyReportView 同結構 -->
      <nav class="flex items-center">
        <button
          class="-ml-2 flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          @click="goBack"
        >
          <ArrowLeft :size="15" :stroke-width="2" />
          <span>總覽</span>
        </button>
      </nav>

      <template v-if="note">
        <div class="mt-3 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-foreground">{{ note.title }}</h2>
            <p class="text-sm text-muted-foreground">{{ note.date }}</p>
          </div>
          <Badge :variant="categoryVariant[note.category]">
            {{ noteCategoryLabel[note.category] }}
          </Badge>
        </div>
      </template>
    </template>

    <template v-if="note">
      <!-- 摘要 + 封面圖 + 標籤 — 與週報 summary 卡片同結構 -->
      <Card>
        <CardContent class="flex flex-col gap-4 p-6">
          <p class="text-base font-medium leading-relaxed text-foreground">
            {{ paragraphs[0] }}
          </p>

          <!-- 封面圖（夾在摘要與內文之間） -->
          <div v-if="note.imageUrl" class="overflow-hidden rounded-xl">
            <img
              :src="note.imageUrl"
              :alt="note.title"
              class="h-48 w-full object-cover sm:h-64"
            />
          </div>

          <p
            v-for="(paragraph, idx) in paragraphs.slice(1)"
            :key="idx"
            class="text-sm leading-5 text-muted-foreground indent-3"
          >
            {{ paragraph }}
          </p>
        </CardContent>
      </Card>

      <!-- 相關記事 — 與週報「選股標的」同結構 -->
      <section v-if="relatedNotes.length" class="flex flex-col gap-3">
        <p class="text-sm font-medium text-muted-foreground">相關記事</p>
        <Card>
          <CardContent class="flex flex-col gap-0 p-2">
            <template v-for="(related, idx) in relatedNotes" :key="related.id">
              <button
                class="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 hover:bg-accent/50"
                @click="navigateToNote(related.id)"
              >
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  :class="iconBg[related.category]"
                >
                  <component
                    :is="categoryIcon[related.category]"
                    :size="14"
                    :stroke-width="1.75"
                    :class="iconColor[related.category]"
                  />
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p class="truncate text-sm font-medium text-foreground">{{ related.title }}</p>
                  <span class="text-[11px] font-mono tabular-nums text-muted-foreground/60">{{ related.date }}</span>
                </div>
                <ChevronRight
                  :size="18"
                  class="shrink-0 text-muted-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand"
                />
              </button>
              <Separator v-if="idx < relatedNotes.length - 1" class="ml-14 opacity-50" />
            </template>
          </CardContent>
        </Card>
      </section>
    </template>

    <!-- 找不到記事 -->
    <Card v-else>
      <CardContent class="flex flex-col items-center justify-center gap-4 p-12">
        <p class="text-lg font-medium text-muted-foreground">找不到此記事</p>
        <button
          class="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
          @click="goBack"
        >
          返回總覽
        </button>
      </CardContent>
    </Card>
  </DefaultLayout>
</template>
