# Weekly Winner

> **版本：** `4.0.5`
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
| UI | shadcn-vue（Card, Table, Badge, Tabs, Dialog, Separator, Avatar, Skeleton, DropdownMenu） |
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
│   │   ├── AppNav.vue          #   懸浮膠囊導航列（disabled 狀態支援）
│   │   ├── ComingSoon.vue     #   開發中功能遮罩頁
│   │   ├── DefaultLayout.vue  #   統一頁面佈局（gap-6 間距系統）
│   │   └── TheHeader.vue      #   頂部導航（Logo + 通知 + LIFF 頭像 + DropdownMenu）
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

## 台股指數 API

資料來源：[證交所 TWSE](https://www.twse.com.tw) FMTQIK（每月各日成交資訊）

### API Endpoint

```
GET /exchangeReport/FMTQIK?response=json&date={yyyyMMdd}
```

回傳 `data` 每列欄位：

| Index | 欄位 |
| --- | --- |
| 0 | 日期 |
| 1 | 成交股數 |
| 2 | 成交金額（作為成交量顯示，換算為億元） |
| 3 | 成交筆數 |
| 4 | 發行量加權股價指數 |
| 5 | 漲跌點數 |

### 環境變數

透過 `VITE_TWSE_BASE_URL` 控制 API base path，兩個環境都使用 `/twse` 前綴：

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

設定位於 `vite.config.ts`：

```typescript
proxy: {
  '/twse': {
    target: 'https://www.twse.com.tw',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/twse/, ''),
    headers: { Referer: 'https://www.twse.com.tw/' },
  },
}
```

**正式環境（Netlify proxy）**

```
瀏覽器 → weeklywinner.netlify.app/twse/exchangeReport/FMTQIK?...
       → Netlify _redirects rewrite
       → 轉發至 https://www.twse.com.tw/exchangeReport/FMTQIK?...
```

設定位於 `public/_redirects`：

```
/twse/*  https://www.twse.com.tw/:splat  200
/*       /index.html                     200
```

### 錯誤處理

- API 失敗時 `index` 為 `null`，UI 顯示 `—` 佔位符，不顯示錯誤數值
- Loading 狀態使用 shadcn Skeleton 元件，依文字缺口排列骨架動畫
- 更新中（有舊資料 + loading）右下角顯示旋轉圖標，不中斷閱讀
- Dashboard 顯示錯誤提示條 + 重試按鈕
- `useMarketIndex` composable 提供 `loading` / `error` / `refresh` 狀態

---

## 功能狀態

| 功能 | 狀態 | 說明 |
| --- | --- | --- |
| Dashboard（加權指數 + 週報 + 記事） | ✅ 已上線 | 即時 API + fallback |
| 選股週報詳細頁 | ✅ 已上線 | 9 欄選股標的表格（桌面表格 / 行動卡片自適應） |
| 個人設定 | ✅ 已上線 | 帳戶安全 / 推播 / 顯示偏好 |
| LINE LIFF 登入 | ✅ 已上線 | Web + LINE 內建瀏覽器 |
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