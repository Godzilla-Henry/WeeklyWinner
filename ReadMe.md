# Weekly Winner

> **版本：** `4.0.3`
> **最後更新：** 2026-04-26
> **適用技術棧：** Vue 3 + TypeScript 5 + Vite 6 + Pinia + Tailwind CSS 4 + shadcn-vue + LINE LIFF SDK + Axios

---

## 技術棧

| 層級 | 技術 |
| --- | --- |
| Framework | Vue 3（`<script setup>` SFC, Composition API） |
| Language | TypeScript 5 — `strict: true`，禁止 `any` / `as` |
| Build | Vite 6 |
| State | Pinia 2 + `pinia-plugin-persistedstate` |
| Routing | Vue Router 4（HTML5 history mode） |
| Styling | Tailwind CSS 4（`@tailwindcss/vite`）+ shadcn-vue（CSS Variables） |
| UI | shadcn-vue（Card, Table, Badge, Tabs, Dialog, Separator, Avatar） |
| Icons | Lucide Vue Next |
| HTTP | Axios（`src/api/request.ts` 認證用 / `src/api/publicRequest.ts` 公開 API 用） |
| Auth | LINE LIFF SDK `@line/liff` |
| Linting | ESLint 9（flat config）+ `typescript-eslint` + `eslint-plugin-vue` |
| Formatting | Prettier 3 + `prettier-plugin-tailwindcss` |

---

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（port 5173）
npm run dev

# 型別檢查
npm run type-check

# 正式建置
npm run build
```

---

## 專案結構

```
src/
├── api/                        # HTTP 請求層
│   ├── http.ts                 #   舊版 fetch 封裝（保留）
│   ├── request.ts              #   Axios 封裝（認證請求）
│   ├── publicRequest.ts        #   Axios 封裝（公開 API，無 Auth）
│   └── modules/
│       └── stock.ts            #   台股加權指數 API
├── assets/
│   ├── img/                    # 靜態圖片（Logo SVG…）
│   └── styles/
│       └── index.css           # Tailwind v4 入口 + CSS 變數主題
├── components/
│   ├── layout/                 # 佈局元件
│   │   ├── AppNav.vue          #   懸浮膠囊導航列
│   │   ├── DefaultLayout.vue   #   統一頁面佈局（gap-6 間距系統）
│   │   └── TheHeader.vue       #   頂部導航（Logo + 通知 + LIFF 頭像）
│   └── ui/                     # shadcn-vue 元件
│       ├── avatar/
│       ├── badge/
│       ├── card/
│       ├── dialog/
│       ├── separator/
│       ├── table/
│       └── tabs/
├── composables/                # 組合式函式
│   ├── useAsyncData.ts
│   ├── useLiff.ts              #   LINE LIFF SDK 封裝（單例模式）
│   ├── useMarketIndex.ts       #   加權指數（真實 API + fallback）
│   ├── useMockData.ts
│   └── useMockPortfolio.ts
├── constants/
│   └── index.ts                # LIFF_ID, APP_NAME 等常數
├── lib/
│   └── utils.ts                # cn() 工具函式
├── plugins/
│   ├── liff.ts                 # LIFF 初始化插件
│   └── pinia.ts
├── router/
│   └── index.ts
├── stores/
│   └── useAuthStore.ts
├── types/
│   ├── shared/                 # 全域型別（.d.ts）
│   │   ├── api.d.ts
│   │   ├── liff.d.ts
│   │   ├── stock.d.ts
│   │   └── user.d.ts
│   └── module/                 # 功能模組型別（.ts，需 export/import）
│       ├── dashboard.ts
│       ├── market.ts
│       ├── report.ts
│       └── trade.ts
├── utils/
│   └── format.ts
├── views/                      # 功能模組（Feature-based）
│   ├── dashboard/
│   │   ├── DashboardView.vue
│   │   ├── types.ts
│   │   └── components/
│   │       ├── MarketIndexCard.vue
│   │       ├── NoteCard.vue
│   │       └── ReportCard.vue
│   ├── portfolio/
│   │   ├── PortfolioView.vue
│   │   └── components/
│   │       ├── HoldingRow.vue
│   │       ├── LiquidBar.vue
│   │       └── LiquidCard.vue
│   ├── records/
│   │   └── RecordsView.vue
│   ├── settings/
│   │   └── SettingsView.vue
│   ├── stock-detail/
│   │   └── StockDetailView.vue
│   └── weekly-report/
│       ├── WeeklyReportView.vue
│       ├── types.ts
│       └── components/
│           └── SelectionTable.vue
├── App.vue
└── main.ts
```

---

## 型別系統

| 分類 | 路徑 | 說明 |
| --- | --- | --- |
| 全域共用 | `types/shared/*.d.ts` | 跨頁面共用的 interface，自動全域可見 |
| 功能模組 | `types/module/*.ts` | 特定功能的型別，需 `export` / `import` |

---

## LINE LIFF 整合

- LIFF ID：`2009896414-Y1G1LW7f`
- 封裝位置：`src/composables/useLiff.ts`（單例模式）
- 初始化時機：`src/plugins/liff.ts`，App mount 前完成
- 功能：init / login / logout / fetchProfile / getAccessToken / closeWindow
- TheHeader 已整合 LIFF 使用者頭像，未登入時顯示 Fallback

---

## 設計系統

- 品牌色：`#E8920A`（Logo 橘），定義為 `--brand`
- 漲跌色：`--gain`（Emerald-600）/ `--loss`（Rose-600）
- 卡片風格：Liquid Design — 白底 + 橘色光斑暈染 + 柔和陰影
- 圓角：`--radius-liquid`（2.5rem）/ `--radius-pill`（9999px）
- 導航列：懸浮膠囊式，白色半透明 + backdrop-blur

---

## 頁面路由

| 路徑 | 名稱 | 說明 |
| --- | --- | --- |
| `/` | dashboard | 加權指數（即時 API）+ 選股週報 / 投資記事 Tab |
| `/stock/:symbol` | stock-detail | 股票詳情（報價 + K 線占位 + 基本面） |
| `/portfolio` | portfolio | 資產分析（LiquidCard + 持股比例 + 明細） |
| `/records` | records | 收益統計（週期卡片 + 操作日誌 Tab） |
| `/settings` | settings | 個人設定（帳戶安全 / 推播 / 顯示偏好） |
| `/weekly-report/:id` | weekly-report | 週報詳細頁（9 欄選股標的表格） |

---

## 版本紀錄

| 版本 | 日期 | 說明 |
| --- | --- | --- |
| `1.0.0` | 2026-04-25 | 初版建立 |
| `2.0.0` | 2026-04-25 | 架構升級：shadcn-vue + 功能導向結構 + Liquid Design |
| `3.0.0` | 2026-04-26 | LINE LIFF SDK 整合、型別系統重構（shared / module 分層）、DefaultLayout 統一佈局 |
| `4.0.0` | 2026-04-26 | 調整手機上的光暈效果 |
| `4.0.1` | 2026-04-26 | 新增Web版Line登入功能，調整登入流程 |
| `4.0.2` | 2026-04-26 | 台股指數 API 串接（證交所 TAIEX + 櫃買 TWO）、Axios 封裝、Vite Proxy、Loading/Error 狀態 |
| `4.0.3` | 2026-04-26 | 移除櫃買指數（CORS 無解），修正 FMTQIK 欄位對應（成交金額=成交量），單一加權指數卡片 |