/**
 * Bug Condition Exploration Test — 行動裝置上 login() 應使用深層連結
 *
 * Validates: Requirements 1.1, 1.2, 2.1, 2.2
 *
 * Property: 對所有行動裝置輸入（UA 含 iPhone/iPad/iPod/Android 或 maxTouchPoints > 1），
 * 呼叫 login() 應設定 window.location.href = `line://app/${LIFF_ID}` 且不呼叫 liff.login()
 *
 * 此測試在未修正的程式碼上預期 FAIL — 失敗即確認 bug 存在
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

/* ── Mock @line/liff ── */
const mockLiffLogin = vi.fn();
const mockLiffInit = vi.fn().mockResolvedValue(undefined);
const mockLiffIsLoggedIn = vi.fn().mockReturnValue(false);
const mockLiffIsInClient = vi.fn().mockReturnValue(false);

vi.mock('@line/liff', () => ({
  default: {
    init: (...args: unknown[]) => mockLiffInit(...args),
    login: (...args: unknown[]) => mockLiffLogin(...args),
    isLoggedIn: () => mockLiffIsLoggedIn(),
    isInClient: () => mockLiffIsInClient(),
  },
}));

/* ── Mock usePwaAuthBridge ── */
vi.mock('@/composables/shared/usePwaAuthBridge', () => ({
  isStandaloneMode: () => false,
  broadcastTokenReady: vi.fn(),
  isLiffCallback: () => false,
}));

/* ── Constants ── */
const LIFF_ID = '2009896414-Y1G1LW7f';

/* ── Arbitraries ── */

/** 行動裝置 UA 關鍵字 */
const mobileKeywords = ['iPhone', 'iPad', 'iPod', 'Android'];

/** 產生包含行動裝置關鍵字的 UA 字串 */
const mobileUaArb = fc.oneof(
  ...mobileKeywords.map((keyword) =>
    fc.tuple(fc.string(), fc.string()).map(([prefix, suffix]) =>
      `Mozilla/5.0 (${prefix}${keyword}${suffix}) AppleWebKit/537.36`,
    ),
  ),
);

/** 產生不含行動裝置關鍵字的 UA 字串（用於 maxTouchPoints > 1 的情境） */
const desktopUaArb = fc
  .string({ minLength: 5, maxLength: 80 })
  .filter((ua) => !mobileKeywords.some((k) => ua.toLowerCase().includes(k.toLowerCase())));

/** maxTouchPoints > 1（觸控裝置，如 iPad 偽裝桌面 UA） */
const touchPointsAbove1Arb = fc.integer({ min: 2, max: 10 });

/** 行動裝置輸入：UA 含關鍵字 OR maxTouchPoints > 1 */
const mobileBugConditionArb = fc.oneof(
  // Case 1: 行動裝置 UA + 任意 touchPoints
  fc.tuple(mobileUaArb, fc.integer({ min: 0, max: 10 })).map(([ua, tp]) => ({
    userAgent: ua,
    maxTouchPoints: tp,
  })),
  // Case 2: 桌面 UA + maxTouchPoints > 1（如 iPad 偽裝桌面模式）
  fc.tuple(desktopUaArb, touchPointsAbove1Arb).map(([ua, tp]) => ({
    userAgent: ua,
    maxTouchPoints: tp,
  })),
);

/* ── 桌面 UA 產生器（不含行動裝置關鍵字） ── */
const desktopUaExamples = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0',
];

/** 從桌面 UA 範例中隨機選取 */
const desktopUaFromExamplesArb = fc.constantFrom(...desktopUaExamples);

/** 產生不含行動裝置關鍵字的隨機 UA 字串 */
const randomDesktopUaArb = fc
  .string({ minLength: 5, maxLength: 80 })
  .filter((ua) => !mobileKeywords.some((k) => ua.toLowerCase().includes(k.toLowerCase())));

/** 桌面 UA：混合真實範例與隨機字串 */
const preservationDesktopUaArb = fc.oneof(desktopUaFromExamplesArb, randomDesktopUaArb);

/** maxTouchPoints ≤ 1（桌面裝置） */
const desktopTouchPointsArb = fc.integer({ min: 0, max: 1 });

/** 桌面裝置輸入（非行動裝置條件） */
const desktopInputArb = fc.record({
  userAgent: preservationDesktopUaArb,
  maxTouchPoints: desktopTouchPointsArb,
  isStandalone: fc.boolean(),
});

describe('Bug Condition Exploration: 行動裝置 login() 應使用深層連結', () => {
  let originalLocation: Location;
  let locationHrefSetter: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // 儲存原始 location 並 mock window.location.href setter
    originalLocation = window.location;
    locationHrefSetter = vi.fn();

    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        origin: 'https://weekly-winner.app',
        pathname: '/dashboard',
        href: 'https://weekly-winner.app/dashboard',
      },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window.location, 'href', {
      get: () => 'https://weekly-winner.app/dashboard',
      set: locationHrefSetter,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it('Property 1: 行動裝置上 login() 應設定 window.location.href 為深層連結且不呼叫 liff.login()', async () => {
    await fc.assert(
      fc.asyncProperty(mobileBugConditionArb, async (input) => {
        // Reset mocks for each iteration
        mockLiffLogin.mockClear();
        locationHrefSetter.mockClear();

        // Mock navigator.userAgent
        Object.defineProperty(navigator, 'userAgent', {
          value: input.userAgent,
          configurable: true,
        });

        // Mock navigator.maxTouchPoints
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: input.maxTouchPoints,
          configurable: true,
        });

        // 重新載入模組以取得新的 login() 實例（因為 initialized ref 需要重置）
        vi.resetModules();

        // Re-mock dependencies after resetModules
        vi.doMock('@line/liff', () => ({
          default: {
            init: mockLiffInit,
            login: mockLiffLogin,
            isLoggedIn: mockLiffIsLoggedIn,
            isInClient: mockLiffIsInClient,
          },
        }));
        vi.doMock('@/composables/shared/usePwaAuthBridge', () => ({
          isStandaloneMode: () => false,
          broadcastTokenReady: vi.fn(),
          isLiffCallback: () => false,
        }));

        const { useLiff } = await import('@/composables/useLiff');
        const { init, login } = useLiff();

        // 初始化 LIFF（使 initialized = true）
        await init();

        // 呼叫 login
        login();

        // 預期行為（修正後）：
        // 1. window.location.href 應被設定為深層連結
        expect(locationHrefSetter).toHaveBeenCalledWith(`line://app/${LIFF_ID}`);
        // 2. liff.login() 不應被呼叫
        expect(mockLiffLogin).not.toHaveBeenCalled();
      }),
      { numRuns: 10 },
    );
  });
});

/**
 * Preservation Property Test — 桌面瀏覽器 login() 維持 liff.login({ redirectUri }) 流程
 *
 * Validates: Requirements 3.1, 3.2, 3.3
 *
 * Property: 對所有非行動裝置輸入（UA 不含 iPhone/iPad/iPod/Android 且 maxTouchPoints ≤ 1），
 * 呼叫 login() 應呼叫 liff.login({ redirectUri }) 且不改變 window.location.href 為深層連結
 *
 * 此測試在未修正的程式碼上預期 PASS — 桌面流程本來就正確
 */
describe('Preservation: 桌面瀏覽器 login() 維持 liff.login({ redirectUri }) 流程', () => {
  let originalLocation: Location;
  let locationHrefSetter: ReturnType<typeof vi.fn>;

  const TEST_ORIGIN = 'https://weekly-winner.app';
  const TEST_PATHNAME = '/dashboard';

  beforeEach(() => {
    vi.clearAllMocks();

    // 儲存原始 location 並 mock window.location
    originalLocation = window.location;
    locationHrefSetter = vi.fn();

    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        origin: TEST_ORIGIN,
        pathname: TEST_PATHNAME,
        href: `${TEST_ORIGIN}${TEST_PATHNAME}`,
      },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window.location, 'href', {
      get: () => `${TEST_ORIGIN}${TEST_PATHNAME}`,
      set: locationHrefSetter,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it('Property 2: 桌面裝置上 login() 應呼叫 liff.login({ redirectUri }) 且不設定深層連結', async () => {
    await fc.assert(
      fc.asyncProperty(desktopInputArb, async (input) => {
        // Reset mocks
        mockLiffLogin.mockClear();
        locationHrefSetter.mockClear();

        // Mock navigator.userAgent（桌面 UA）
        Object.defineProperty(navigator, 'userAgent', {
          value: input.userAgent,
          configurable: true,
        });

        // Mock navigator.maxTouchPoints（≤ 1）
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: input.maxTouchPoints,
          configurable: true,
        });

        // 重新載入模組
        vi.resetModules();

        // Re-mock dependencies after resetModules
        vi.doMock('@line/liff', () => ({
          default: {
            init: mockLiffInit,
            login: mockLiffLogin,
            isLoggedIn: mockLiffIsLoggedIn,
            isInClient: mockLiffIsInClient,
          },
        }));
        vi.doMock('@/composables/shared/usePwaAuthBridge', () => ({
          isStandaloneMode: () => input.isStandalone,
          broadcastTokenReady: vi.fn(),
          isLiffCallback: () => false,
        }));

        const { useLiff } = await import('@/composables/useLiff');
        const { init, login } = useLiff();

        // 初始化 LIFF
        await init();

        // 呼叫 login
        login();

        // 計算預期的 redirectUri
        const expectedRedirectUri = input.isStandalone
          ? TEST_ORIGIN
          : `${TEST_ORIGIN}${TEST_PATHNAME}`;

        // 預期行為（桌面流程）：
        // 1. liff.login() 應被呼叫且帶正確的 redirectUri
        expect(mockLiffLogin).toHaveBeenCalledWith({ redirectUri: expectedRedirectUri });
        // 2. window.location.href 不應被設定為深層連結
        expect(locationHrefSetter).not.toHaveBeenCalled();
      }),
      { numRuns: 10 },
    );
  });
});
