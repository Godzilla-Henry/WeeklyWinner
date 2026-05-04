import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
  },
  {
    path: '/stock/:symbol',
    name: 'stock-detail',
    component: () => import('@/views/stock-detail/StockDetailView.vue'),
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('@/views/portfolio/PortfolioView.vue'),
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('@/views/records/RecordsView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/SettingsView.vue'),
  },
  {
    path: '/weekly-report/:id',
    name: 'weekly-report',
    component: () => import('@/views/weekly-report/WeeklyReportView.vue'),
  },
  {
    path: '/invest-note/:id',
    name: 'invest-note',
    component: () => import('@/views/invest-note/InvestNoteView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
