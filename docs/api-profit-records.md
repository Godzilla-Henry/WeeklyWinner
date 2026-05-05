# 收益記錄功能 — 後端 API 規格文件

## 目錄

1. [功能概述](#功能概述)
2. [資料模型](#資料模型)
3. [API 接口](#api-接口)
   - [收益記錄 CRUD](#收益記錄-crud)
   - [年度目標](#年度目標)
4. [回應格式規範](#回應格式規範)
5. [錯誤碼](#錯誤碼)
6. [前端型別對照](#前端型別對照)
7. [Query Key 規劃](#query-key-規劃)

---

## 功能概述

收益記錄（Profit Records）功能讓使用者以**月份為最小單位**記錄個股損益，並提供以下分析視圖：

| 功能 | 說明 |
|------|------|
| 新增記錄 | 記錄指定年月的個股損益與備註 |
| 月份佔比圖 | 圓餅圖顯示當月各股票獲利貢獻比例 |
| 年度走勢圖 | 長條圖顯示該年度 1–12 月總損益趨勢 |
| 明細表格 | 列出指定年月的所有記錄 |
| 年度目標 | 設定年度收益目標，追蹤達成進度 |

所有 API 均需 **Bearer Token 認證**（LINE Access Token）。

---

## 資料模型

### 資料庫 Schema

#### `profit_records` 表

| 欄位 | 型別 | 說明 | 限制 |
|------|------|------|------|
| `id` | `UUID` | 主鍵 | PK, auto-generated |
| `user_id` | `UUID` | 使用者 ID | FK → users.id, NOT NULL |
| `year` | `INTEGER` | 年份 | NOT NULL, 2000–2100 |
| `month` | `INTEGER` | 月份 | NOT NULL, 1–12 |
| `stock_name` | `VARCHAR(50)` | 股票名稱 | NOT NULL |
| `profit_loss` | `INTEGER` | 損益金額（新台幣元）| NOT NULL，負數為虧損 |
| `note` | `VARCHAR(200)` | 備註 | 可為空字串 |
| `created_at` | `TIMESTAMP` | 建立時間 | NOT NULL, DEFAULT NOW() |
| `updated_at` | `TIMESTAMP` | 更新時間 | NOT NULL, DEFAULT NOW() |

#### `yearly_goals` 表

| 欄位 | 型別 | 說明 | 限制 |
|------|------|------|------|
| `id` | `UUID` | 主鍵 | PK, auto-generated |
| `user_id` | `UUID` | 使用者 ID | FK → users.id, NOT NULL |
| `year` | `INTEGER` | 目標年份 | NOT NULL |
| `target_amount` | `INTEGER` | 目標金額（新台幣元）| NOT NULL, > 0 |
| `created_at` | `TIMESTAMP` | 建立時間 | NOT NULL, DEFAULT NOW() |
| `updated_at` | `TIMESTAMP` | 更新時間 | NOT NULL, DEFAULT NOW() |

> **唯一約束**：`(user_id, year)` 組合唯一，每位使用者每年只能有一筆目標。

---

## API 接口

### 基礎路徑

```
/api/profit-records
/api/yearly-goals
```

---

### 收益記錄 CRUD

#### `GET /api/profit-records`

取得當前使用者的收益記錄列表，支援年份與月份篩選。

**Request Headers**

```
Authorization: Bearer <LINE_ACCESS_TOKEN>
```

**Query Parameters**

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `year` | `integer` | 否 | 篩選年份，不傳則回傳所有年份 |
| `month` | `integer` | 否 | 篩選月份（1–12），需搭配 `year` 使用 |

**Response `200 OK`**

```json
{
  "ok": true,
  "records": [
    {
      "id": "uuid-string",
      "year": 2026,
      "month": 4,
      "stock_name": "台積電",
      "profit_loss": 63000,
      "note": "外資回補",
      "created_at": "2026-04-30T10:00:00Z",
      "updated_at": "2026-04-30T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

#### `POST /api/profit-records`

新增一筆收益記錄。

**Request Headers**

```
Authorization: Bearer <LINE_ACCESS_TOKEN>
Content-Type: application/json
```

**Request Body**

```json
{
  "year": 2026,
  "month": 4,
  "stock_name": "台積電",
  "profit_loss": 63000,
  "note": "外資回補"
}
```

| 欄位 | 型別 | 必填 | 驗證規則 |
|------|------|------|----------|
| `year` | `integer` | ✅ | 2000–2100 |
| `month` | `integer` | ✅ | 1–12 |
| `stock_name` | `string` | ✅ | 1–50 字元，不可為空白 |
| `profit_loss` | `integer` | ✅ | 非零整數，正數獲利、負數虧損 |
| `note` | `string` | 否 | 最多 200 字元，預設空字串 |

**Response `201 Created`**

```json
{
  "ok": true,
  "record": {
    "id": "uuid-string",
    "year": 2026,
    "month": 4,
    "stock_name": "台積電",
    "profit_loss": 63000,
    "note": "外資回補",
    "created_at": "2026-05-05T10:00:00Z",
    "updated_at": "2026-05-05T10:00:00Z"
  }
}
```

---

#### `PUT /api/profit-records/:id`

更新指定收益記錄（僅限本人資料）。

**Request Body**（所有欄位皆為選填，至少傳一個）

```json
{
  "year": 2026,
  "month": 4,
  "stock_name": "台積電",
  "profit_loss": 70000,
  "note": "外資持續回補"
}
```

**Response `200 OK`**

```json
{
  "ok": true,
  "record": {
    "id": "uuid-string",
    "year": 2026,
    "month": 4,
    "stock_name": "台積電",
    "profit_loss": 70000,
    "note": "外資持續回補",
    "created_at": "2026-05-05T10:00:00Z",
    "updated_at": "2026-05-05T12:30:00Z"
  }
}
```

---

#### `DELETE /api/profit-records/:id`

刪除指定收益記錄（僅限本人資料）。

**Response `200 OK`**

```json
{
  "ok": true
}
```

---

### 年度目標

#### `GET /api/yearly-goals`

取得當前使用者所有年度目標。

**Query Parameters**

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `year` | `integer` | 否 | 篩選特定年份 |

**Response `200 OK`**

```json
{
  "ok": true,
  "goals": [
    {
      "id": "uuid-string",
      "year": 2026,
      "target_amount": 300000,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

#### `PUT /api/yearly-goals/:year`

設定或更新指定年份的目標（Upsert）。若該年份目標不存在則新增，已存在則更新。

**Request Body**

```json
{
  "target_amount": 300000
}
```

| 欄位 | 型別 | 必填 | 驗證規則 |
|------|------|------|----------|
| `target_amount` | `integer` | ✅ | > 0 |

**Response `200 OK`**

```json
{
  "ok": true,
  "goal": {
    "id": "uuid-string",
    "year": 2026,
    "target_amount": 300000,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-05-05T10:00:00Z"
  }
}
```

---

## 回應格式規範

所有回應遵循現有系統的 `ApiResponse<T>` 信封格式：

```typescript
interface ApiResponse<T = unknown> {
  ok: boolean;       // 請求是否成功
  error?: string;    // 失敗時的錯誤訊息
}
```

> **注意**：後端回傳 `snake_case`，前端 HTTP 層（`src/api/http.ts`）會自動轉換為 `camelCase`，前端型別定義均使用 camelCase。

---

## 錯誤碼

| HTTP 狀態碼 | `ok` | 情境 |
|-------------|------|------|
| `200` | `true` | 成功 |
| `201` | `true` | 新增成功 |
| `400` | `false` | 請求參數驗證失敗 |
| `401` | `false` | 未認證或 Token 過期 |
| `403` | `false` | 無權限操作他人資料 |
| `404` | `false` | 記錄不存在 |
| `500` | `false` | 伺服器內部錯誤 |

**錯誤回應範例**

```json
{
  "ok": false,
  "error": "stock_name 不可為空白"
}
```

---

## 前端型別對照

後端 `snake_case` 欄位經 `snakeToCamel()` 轉換後，對應前端型別如下：

### `ProfitRecord`

```typescript
// src/types/module/records.ts
interface ProfitRecord {
  id: string;           // id
  year: number;         // year
  month: number;        // month
  stockName: string;    // stock_name
  profitLoss: number;   // profit_loss
  note: string;         // note
}
```

### `ProfitRecordForm`（新增 / 更新表單）

```typescript
interface ProfitRecordForm {
  year: number;
  month: number;
  stockName: string;    // → stock_name
  profitLoss: number;   // → profit_loss
  note: string;
}
```

### `YearlyGoal`

```typescript
interface YearlyGoal {
  year: number;
  targetAmount: number; // target_amount
}
```

### API 回應型別（需新增至 `src/types/api.ts`）

```typescript
/** 收益記錄列表回應 */
interface ProfitRecordsResponse {
  ok: boolean;
  records: ProfitRecord[];
  total: number;
}

/** 單筆收益記錄回應 */
interface ProfitRecordResponse {
  ok: boolean;
  record: ProfitRecord;
}

/** 年度目標列表回應 */
interface YearlyGoalsResponse {
  ok: boolean;
  goals: YearlyGoal[];
}

/** 單筆年度目標回應 */
interface YearlyGoalResponse {
  ok: boolean;
  goal: YearlyGoal;
}
```

---

## Query Key 規劃

需新增至 `src/api/queryKeys.ts`：

```typescript
/** 收益記錄 */
profitRecords: {
  all: ['profitRecords'] as const,
  list: (year?: number, month?: number) =>
    ['profitRecords', 'list', { year, month }] as const,
},

/** 年度目標 */
yearlyGoals: {
  all: ['yearlyGoals'] as const,
  byYear: (year: number) => ['yearlyGoals', year] as const,
},
```

---

## 前端串接規劃

後端完成後，前端需建立以下檔案取代 Mock：

| 檔案 | 說明 |
|------|------|
| `src/api/modules/profitRecords.ts` | API 呼叫函式（`getProfitRecords`, `createProfitRecord`, `updateProfitRecord`, `deleteProfitRecord`） |
| `src/api/modules/yearlyGoals.ts` | API 呼叫函式（`getYearlyGoals`, `upsertYearlyGoal`） |
| `src/composables/module/useProfitRecordsQuery.ts` | TanStack Query composable，取代 `useMockRecords` |
