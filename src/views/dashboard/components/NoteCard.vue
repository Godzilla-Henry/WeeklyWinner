<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, BarChart3, Zap } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { InvestNote, NoteCategory } from '../types';
import { noteCategoryLabel } from '../types';

interface Props {
  note: InvestNote;
}

const props = defineProps<Props>();

const categoryIcon: Record<NoteCategory, Component> = {
  direction: Compass,
  indicator: BarChart3,
  event: Zap,
};

const categoryVariant: Record<NoteCategory, 'brand' | 'gain' | 'secondary'> = {
  direction: 'brand',
  indicator: 'gain',
  event: 'secondary',
};
</script>

<template>
  <Card class="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover)">
    <CardContent class="flex gap-4 p-5">
      <!-- 類型圖標 -->
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-muted">
        <component :is="categoryIcon[props.note.category]" :size="16" :stroke-width="1.75" class="text-brand" />
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-1.5">
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-foreground">{{ props.note.title }}</p>
          <Badge :variant="categoryVariant[props.note.category]" class="shrink-0 text-[10px]">
            {{ noteCategoryLabel[props.note.category] }}
          </Badge>
        </div>
        <p class="text-sm leading-relaxed text-muted-foreground">{{ props.note.content }}</p>
        <p class="text-xs text-muted-foreground/60">{{ props.note.date }}</p>
      </div>
    </CardContent>
  </Card>
</template>
