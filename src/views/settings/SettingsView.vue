<script setup lang="ts">
import type { Component } from 'vue';
import { ShieldCheck, Bell, Palette, Lightbulb, ChevronRight } from 'lucide-vue-next';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SettingSection {
  icon: Component;
  title: string;
  description: string;
  items: string[];
}

const sections: SettingSection[] = [
  {
    icon: ShieldCheck,
    title: '帳戶安全',
    description: '您的資產安全是我們的首要承諾。所有交易資料皆採用銀行等級加密傳輸，確保每一筆操作都受到嚴密保護。',
    items: ['變更密碼', '雙重驗證 (2FA)', '登入裝置管理', '生物辨識設定'],
  },
  {
    icon: Bell,
    title: '推播提醒',
    description: '即時掌握市場脈動，不錯過任何關鍵時刻。自訂您的提醒策略，讓重要資訊主動找到您。',
    items: ['到價提醒', '漲跌幅警示', '週報推播', '除權息通知'],
  },
  {
    icon: Palette,
    title: '顯示偏好',
    description: '打造專屬於您的投資介面。從色彩主題到數據排列，每個細節都為您的閱讀舒適度而設計。',
    items: ['深色 / 淺色模式', '報價顏色配置', '首頁版面配置', '字體大小調整'],
  },
  {
    icon: Lightbulb,
    title: '關於我們',
    description: 'Weekly Winner 致力於為每位投資人提供清晰、精準的市場洞察。我們相信，好的工具能讓決策更從容。',
    items: ['版本資訊 v0.1.0', '使用條款', '隱私權政策', '意見回饋'],
  },
];
</script>

<template>
  <DefaultLayout
    title="個人設定"
    subtitle="管理您的帳戶與偏好"
  >
    <Card
      v-for="section in sections"
      :key="section.title"
    >
      <CardHeader>
        <div class="flex items-center gap-2.5">
          <component
            :is="section.icon"
            :size="20"
            :stroke-width="1.75"
            class="text-brand"
          />
          <CardTitle>{{ section.title }}</CardTitle>
        </div>
        <CardDescription>{{ section.description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col">
          <button
            v-for="item in section.items"
            :key="item"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-accent"
          >
            <span>{{ item }}</span>
            <ChevronRight
              :size="16"
              class="text-muted-foreground"
            />
          </button>
        </div>
      </CardContent>
    </Card>
  </DefaultLayout>
</template>
