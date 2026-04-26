<template>
  <Card
    class="group cursor-pointer transition-all duration-300 hover:shadow-(--shadow-card-hover) hover:-translate-y-0.5"
    @click="navigateToReport"
  >
    <CardHeader class="pb-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-muted">
            <Calendar :size="18" :stroke-width="1.75" class="text-brand" />
          </div>
          <div>
            <CardTitle class="text-[15px]">{{ props.report.title }}</CardTitle>
            <p class="mt-0.5 text-xs text-muted-foreground">{{ props.report.date }}</p>
          </div>
        </div>
        <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary transition-all duration-300 group-hover:bg-brand/10">
          <ChevronRight
            :size="14"
            class="text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand"
          />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p class="mb-3 text-sm leading-relaxed text-muted-foreground">
        {{ props.report.summary }}
      </p>
      <div class="flex flex-wrap gap-1.5">
        <Badge
          v-for="tag in props.report.tags"
          :key="tag"
          variant="brand"
        >
          {{ tag }}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight } from 'lucide-vue-next';
import type { WeeklyReport } from '../types';

interface Props {
  report: WeeklyReport;
}

const props = defineProps<Props>();
const router = useRouter();

function navigateToReport(): void {
  void router.push({ name: 'weekly-report', params: { id: props.report.id } });
}
</script>