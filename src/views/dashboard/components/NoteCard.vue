<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, BookOpen, Zap, ChevronRight } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { InvestNoteSummary, NoteCategory } from '../types';
import { noteCategoryLabel } from '../types';

interface Props {
  note: InvestNoteSummary;
  isUnread?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isUnread: false,
});

const router = useRouter();

const categoryIcon: Record<NoteCategory, Component> = {
  direction: Compass,
  note: BookOpen,
  event: Zap,
};

const iconBg: Record<NoteCategory, string> = {
  direction: 'bg-blue-500/10',
  note: 'bg-emerald-500/10',
  event: 'bg-amber-500/10',
};

const iconColor: Record<NoteCategory, string> = {
  direction: 'text-blue-500',
  note: 'text-emerald-500',
  event: 'text-amber-500',
};

const categoryBadgeClass: Record<NoteCategory, string> = {
  direction: 'bg-blue-500/10 text-blue-600',
  note: 'bg-emerald-500/10 text-emerald-600',
  event: 'bg-amber-500/10 text-amber-600',
};

function navigateToNote(): void {
  void router.push({ name: 'invest-note', params: { id: props.note.id } });
}
</script>

<template>
  <Card
    class="group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover)"
    @click="navigateToNote"
  >
    <CardHeader>
      <div class="flex items-start justify-between gap-3">
        <!-- 左側：Icon + 內容 -->
        <div class="flex items-center gap-3">
          <div
            class="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            :class="iconBg[props.note.category]"
          >
            <component
              :is="categoryIcon[props.note.category]"
              :size="18"
              :stroke-width="1.75"
              :class="iconColor[props.note.category]"
            />
            <span
              v-if="props.isUnread"
              class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gain ring-2 ring-card"
            />
          </div>

          <div class="flex min-w-0 flex-col gap-1">
            <!-- 標題 -->
            <p class="text-[15px] font-semibold leading-snug text-foreground">
              {{ props.note.title }}
              <Badge v-if="props.isUnread" variant="gain" class="px-1.5 py-0 text-[10px]">
                NEW
              </Badge>
            </p>

            <!-- 類型 + 日期 -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs text-muted-foreground">{{ props.note.publishDate }}</span>
              <Badge :class="categoryBadgeClass[props.note.category]" class="text-[10px]">
                {{ noteCategoryLabel[props.note.category] }}
              </Badge>
            </div>
          </div>

          <!-- 右側箭頭 -->
          <div class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary transition-all duration-300 group-hover:bg-brand/10">
            <ChevronRight
              :size="14"
              class="text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand"
            />
          </div>
        </div>
      </div>
    </CardHeader>
  </Card>
</template>
