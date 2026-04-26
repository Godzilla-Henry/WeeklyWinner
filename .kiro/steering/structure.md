# Project Structure

採用**功能導向 (Feature-based)** 目錄結構，UI 層基於 **shadcn-vue** 元件系統。

```
src/
├── api/                        # HTTP 請求層（按領域分檔）
│   └── http.ts                 #   fetch 封裝，所有請求經由此處
│
├── assets/
│   └── styles/
│       └── index.css           # Tailwind v4 入口 + shadcn CSS 變數主題
│
├── components/                 # 全域共用元件（跨頁面複用）
│   ├── ui/                     #   shadcn-vue 元件（由 CLI 或手動安裝）
│   │   ├── card/               #     Card, CardHeader, CardTitle…
│   │   ├── badge/              #     Badge（含 gain/loss 變體）
│   │   ├── table/              #     Table, TableRow, TableCell…
│   │   ├── tabs/               #     Tabs, TabsList, TabsTrigger…
│   │   └── separator/          #     Separator
│   └── layout/                 #   佈局元件（AppNav, Header…）
│
├── composables/                # 組合式函式 — 以 `use` 前綴命名
├── constants/                  # 全域常數（UPPER_SNAKE_CASE）
├── lib/                        # 工具庫（shadcn cn() 等）
│   └── utils.ts
├── plugins/                    # Vue 插件初始化（Pinia, i18n…）
│
├── router/
│   └── index.ts                # 路由定義（lazy-loaded views）
│
├── stores/                     # Pinia 狀態管理 — 以 `use___Store` 命名
├── types/                      # 全域型別定義（.d.ts）— 僅 interface / type
├── utils/                      # 純工具函式 — 無副作用、無框架依賴
│
├── views/                      # 功能模組（每個頁面一個資料夾）
│   ├── dashboard/
│   │   ├── DashboardView.vue
│   │   ├── components/         #   私有元件（NewsCard…）
│   │   └── dialogs/
│   ├── stock-detail/
│   ├── portfolio/
│   ├── records/
│   └── settings/
│
├── App.vue
└── main.ts
```

## shadcn-vue 元件規範

### 存放位置

所有 shadcn-vue 基礎元件存放於 `src/components/ui/[component-name]/`，每個元件一個資料夾，包含：

```
components/ui/card/
├── Card.vue
├── CardHeader.vue
├── CardTitle.vue
├── CardDescription.vue
├── CardContent.vue
├── CardFooter.vue
└── index.ts            # 統一匯出
```

### 使用規則

- shadcn 原始元件**不可修改**，如需客製化透過 `class` prop 傳入 Tailwind 類名
- 若需二次封裝且僅供單一頁面使用，封裝後的元件放在 `views/[feature]/components/`
- 匯入方式：`import { Card, CardContent } from '@/components/ui/card'`
- 新增 shadcn 元件：`pnpm dlx shadcn-vue@latest add [component]` 或手動建立

### 主題系統

- CSS 變數定義於 `src/assets/styles/index.css`
- 語義色：`--background`, `--foreground`, `--card`, `--primary`, `--muted` 等
- FinTech 專用色：`--gain`（漲 / Emerald）、`--loss`（跌 / Rose）
- 強調色：`--primary`（Amber）
- 使用方式：`text-gain`, `text-loss`, `bg-primary`, `text-muted-foreground`

### Badge 變體

| Variant | 用途 | 樣式 |
| --- | --- | --- |
| `default` | 預設強調 | Amber 背景 |
| `secondary` | 次要資訊 | Zinc 背景 |
| `destructive` | 錯誤/警告 | Rose 背景 |
| `gain` | 漲幅/買入 | Emerald 透明背景 |
| `loss` | 跌幅/賣出 | Rose 透明背景 |
| `outline` | 輪廓 | 邊框 |

## 功能模組結構規範

每個 `views/[feature]/` 資料夾**必須**遵循以下結構：

```
views/[feature]/
├── [Feature]View.vue       # 入口頁面（對應路由）
├── components/             # 僅供該頁面使用的私有元件
└── dialogs/                # 僅供該頁面使用的私有彈窗
```

### 元件歸屬判定

| 條件 | 放置位置 |
| --- | --- |
| shadcn 基礎元件 | `src/components/ui/[name]/` |
| 被 2 個以上頁面引用的封裝元件 | `src/components/` |
| 僅被 1 個頁面引用 | `views/[feature]/components/` |
| 彈窗 / Dialog 類元件 | `views/[feature]/dialogs/` |

### Import 路徑規則

- shadcn 元件：`import { Card } from '@/components/ui/card'`
- 私有元件：`import Foo from './components/Foo.vue'`
- 工具函式：`import { cn } from '@/lib/utils'`

## Naming Conventions

| Item | Convention | Example |
| --- | --- | --- |
| Feature folder | kebab-case | `stock-detail/` |
| shadcn component folder | kebab-case | `card/`, `badge/` |
| View file | PascalCase + `View` 後綴 | `DashboardView.vue` |
| Component file | PascalCase | `NewsCard.vue` |
| Composable | `use` prefix | `useAsyncData.ts` |
| Store | `use___Store` | `useAuthStore.ts` |
| Route name | kebab-case | `stock-detail` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |

## Architecture Rules

- 禁止在組件或 Store 中直接呼叫 `fetch` — 一律經由 `src/api/`
- `src/components/ui/` 僅存放 shadcn 原始元件，不含業務邏輯
- 私有元件歸屬於 `views/[feature]/components/`
- 100% 使用 Tailwind CSS，禁止自定義 CSS（shadcn 變數定義除外）
- Views 為薄層協調者 — 邏輯委派給 composables 與 stores
- 路由使用 lazy import：`component: () => import('@/views/[feature]/[Feature]View.vue')`
