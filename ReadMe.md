# Weekly Winner

> **版本：** `5.0.0`
> **最後更新：** 2026-05-01
> **適用技術棧：** Vue 3 + TypeScript 5 + Vite 6 + Pinia + TanStack Query + Tailwind CSS 4 + shadcn-vue + LINE LIFF SDK

---

## 技術棧

| 層級 | 技術 |
| --- | --- |
| Framework | Vue 3（`<script setup>` SFC, Composition API） |
| Language | TypeScript 5 — `strict: true`，禁止 `any` / `as` |
| Build | Vite 6 |
| State | Pinia 2 + `pinia-plugin-persistedstate` |
| Server State | TanStack Vue Query 5（快取、重試、自動失效） |
| Routing | Vue Router 4（HTML5 history mode） |
| Styling | Tailwind CSS 4（`@tailwindcss/vite`）+ shadcn-vue（CSS Variables） |
| UI | shadcn-vue（Card, Table, Badge, Tabs, Dialog, Separator, Avatar, Skeleton, DropdownMenu） |
| Icons | Lucide Vue Next |
| HTTP | Native `fetch` 封裝（`src/api/http.ts` 認證用 / `src/api/publicHttp.ts` 公開 API 用） |
| Auth | LINE LIFF SDK `@line/liff` |
| Linting | ESLint 9（flat config）+ `typescript-eslint` + `eslint-plugin-vue` |
| Formatting | Prettier 3 + `prettier-plugin-tailwindcss` |

---

## 快速開始

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器（port 5173）
pnpm dev

# 型別檢查
pnpm type-check

# 正式建置
pnpm build
```

---

## 專案結構

```
src/
├── api/                        # HTTP 請求層（按領域分檔）
│   ├── http.ts                 #   fetch 封裝（認證請求，Bearer idToken）
│   ├── publicHttp.ts           #   fetch 封裝（公開 API，無 Auth）
│   ├── queryKeys.ts            #   TanStack Query Key 工廠
│   ├── index.ts                #   統一匯出
│   └── modules/
│       ├── auth.ts             #   認證 API（login）
│       ├── report.ts           #   週報 API（list / detail）
│       ├── stock.ts            #   台股加權指數 API（證交所 FMTQIK）
│       └── unread.ts           #   未讀數量 API（counts / mark-as-read）
├── assets/
│   ├── img/                    # 靜態圖片（Logo SVG…）
│   └── styles/
│       └── index.css           # Tailwind v4 入口 + CSS 變數主題
├── components/
│   ├── layout/                 # 佈局元件
│   │   ├── AppNav.vue          #   懸浮膠囊導航列
│   │   ├── ComingSoon.vue      #   開發中功能遮罩頁
│   │   ├── DefaultLayout.vue   #   統一頁面佈局
│   │   └── TheHeader.vue       #   頂部導航（Logo + 通知 + LIFF 頭像）
│   └── ui/                     # shadcn-vue 元件
│       ├── avatar/
│       ├── badge/
│       ├── card/
│       ├── dialog/
│       ├── dropdown-menu/
│       ├── separator/
│       ├── skeleton/
│       ├── table/
│       └── tabs/
├── composables/                # 組合式函式
│   ├── shared/                 #   共用 API 工具
│   │   └── useLiffToken.ts     #     LINE ID Token 取得
│   ├── module/                 #   功能模組 TanStack Query Composables
│   │   ├── useAuthQuery.ts     #     登入同步 Mutation
│   │   ├── useMarketIndex.ts   #     加權指數 Query
│   │   ├── useReportQuery.ts   #     週報列表 / 詳情 Query
│   │   └── useUnreadQuery.ts   #     未讀數量 Query + 標記已讀 Mutation
│   ├── useLiff.ts              #   LINE LIFF SDK 封裝（單例模式）
│   ├── useMockData.ts          #   Mock 資料（開發用）
│   └── useMockPortfolio.ts     #   Mock 資產資料（開發用）
├── constants/
│   └── index.ts                # LIFF_ID, APP_NAME 等常數
├── lib/
│   └── utils.ts                # cn() 工具函式
├── plugins/
│   ├── liff.ts                 # LIFF 初始化插件
│   ├── pinia.ts                # Pinia 插件
│   └── queryClient.ts          # TanStack Vue Query 插件
├── router/
│   └── index.ts
├── stores/
│   └── useAuthStore.ts         # 認證狀態（Profile 持久化）
├── types/
│   ├── api.ts                  # 後端 API 型別定義（snake_case → camelCase）
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
│   ├── caseTransform.ts        # snake_case → camelCase 轉換工具
│   └── format.ts               # 日期 / 文字格式化
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

## API 架構

### 分層設計

```
View / Composable
  ↓ 呼叫 TanStack Query Composable
composables/module/useReportQuery.ts
  ↓ 呼叫 API 函式
api/modules/report.ts
  ↓ 經由 HTTP 封裝
api/http.ts（認證）/ api/publicHttp.ts（公開）
  ↓
後端 / 外部 API
```

### API 模組

| 模組 | 檔案 | 端點 |
| --- | --- | --- |
| 認證 | `api/modules/auth.ts` | `POST /api/auth/login` |
| 週報 | `api/modules/report.ts` | `GET /api/reports`, `GET /api/reports/:id` |
| 未讀 | `api/modules/unread.ts` | `GET /api/unread-count`, `POST /api/mark-as-read` |
| 台股指數 | `api/modules/stock.ts` | 證交所 FMTQIK（公開 API） |

### TanStack Query 整合

| Composable | 用途 | Query Key |
| --- | --- | --- |
| `useReportsQuery` | 週報列表 | `['reports', 'list', { page, limit }]` |
| `useReportDetailQuery` | 週報詳情 | `['reports', 'detail', id]` |
| `useUnreadCountsQuery` | 未讀數量彙總 | `['unread', 'counts']` |
| `useUnreadCountQuery` | 指定類型未讀 | `['unread', contentType]` |
| `useMarkAsReadMutation` | 標記已讀 | 自動 invalidate `['unread']` |
| `useLoginMutation` | 登入同步 | — |
| `useMarketIndex` | 加權指數 | `['market', 'taiex']` |

### snake_case → camelCase 轉換

後端回傳 snake_case，前端自動轉換為 camelCase：

| 後端 | 前端 |
| --- | --- |
| `report_id` | `reportId` |
| `close_price` | `closePrice` |
| `target_price` | `targetPrice` |
| `monthly_bias` | `monthlyBias` |
| `created_at` | `createdAt` |
| `content_type` | `contentType` |
| `content_id` | `contentId` |
| `read_at` | `readAt` |
| `user_id` | `userId` |
| `image_url` | `imageUrl` |

---

## 型別系統

| 分類 | 路徑 | 說明 |
| --- | --- | --- |
| API 型別 | `types/api.ts` | 後端 API 回應型別（camelCase） |
| 全域共用 | `types/shared/*.d.ts` | 跨頁面共用的 interface，自動全域可見 |
| 功能模組 | `types/module/*.ts` | 特定功能的型別，需 `export` / `import` |

---

## LINE LIFF 整合

- LIFF ID：`2009896414-Y1G1LW7f`
- 封裝位置：`src/composables/useLiff.ts`（單例模式）
- 初始化時機：`src/plugins/liff.ts`，App mount 前完成
- 認證方式：`liff.getIDToken()` → `Authorization: Bearer <idToken>`
- 功能：init / login / logout / fetchProfile / getAccessToken / closeWindow
- TheHeader 已整合 LIFF 使用者頭像，未登入時顯示 Fallback

---

## 台股指數 API

資料來源：[證交所 TWSE](https://www.twse.com.tw) FMTQIK（每月各日成交資訊）

### API Endpoint

```
GET /exchangeReport/FMTQIK?response=json&date={yyyyMMdd}
```

### 日期 Fallback 機制

`date` 參數代表查詢「該月份」的資料。若當月尚無交易日（月初遇假日、國定假日等），自動 fallback 查上個月資料，確保永遠有資料可顯示。

### 環境變數

透過 `VITE_TWSE_BASE_URL` 控制 API base path：

| 檔案 | 值 | 說明 |
| --- | --- | --- |
| `.env.development` | `/twse` | Vite dev server proxy 攔截轉發 |
| `.env.production` | `/twse` | Netlify `_redirects` proxy 轉發 |

### Proxy 機制

證交所 API 有 CORS 限制，前端無法直連，需透過 proxy 轉發：

**開發環境（Vite proxy）**

```
瀏覽器 → localhost:5173/twse/exchangeReport/FMTQIK?...
       → Vite proxy rewrite 移除 /twse 前綴
       → 轉發至 https://www.twse.com.tw/exchangeReport/FMTQIK?...
```

**正式環境（Netlify proxy）**

```
瀏覽器 → weeklywinner.netlify.app/twse/exchangeReport/FMTQIK?...
       → Netlify _redirects rewrite
       → 轉發至 https://www.twse.com.tw/exchangeReport/FMTQIK?...
```

---

## 功能狀態

| 功能 | 狀態 | 說明 |
| --- | --- | --- |
| Dashboard（加權指數 + 週報 + 記事） | ✅ 已上線 | 即時 API + fallback |
| 選股週報詳細頁 | ✅ 已上線 | 9 欄選股標的表格（桌面表格 / 行動卡片自適應） |
| 個人設定 | ✅ 已上線 | 帳戶安全 / 推播 / 顯示偏好 |
| LINE LIFF 登入 | ✅ 已上線 | Web + LINE 內建瀏覽器 |
| 後端 API 整合 | ✅ 已完成 | TanStack Query + fetch 封裝 |
| 股市資產（Portfolio） | 🚧 開發中 | ComingSoon 遮罩 |
| 收益統計（Records） | 🚧 開發中 | ComingSoon 遮罩 |

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
| `4.0.4` | 2026-04-26 | 環境變數區分正式/開發 API proxy、Netlify `_redirects` 設定、Portfolio/Records 加入 ComingSoon 遮罩 |
| `4.0.5` | 2026-04-26 | Skeleton 載入狀態、API 失敗顯示 `—`、選股標的類型三色 Badge、SelectionTable 行動版卡片自適應、DropdownMenu 元件 |
| `5.0.0` | 2026-05-01 | **API 架構重構**：移除 Axios 改用 native fetch、TanStack Vue Query 整合、API 模組化（auth/report/unread/stock）、composables 分層（shared/module）、snake_case→camelCase 自動轉換、FMTQIK 月份 fallback 修正 |
