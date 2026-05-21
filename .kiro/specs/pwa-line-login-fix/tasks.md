# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** — 行動裝置上 login() 呼叫 liff.login() 而非深層連結
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Setup**: Install `vitest` + `fast-check` as devDependencies, create `vitest.config.ts` with jsdom environment, add `"test": "vitest --run"` script to package.json
  - **Scoped PBT Approach**: Scope the property to mobile user agents (containing iPhone/iPad/iPod/Android or maxTouchPoints > 1)
  - Test file: `src/composables/__tests__/useLiff.login.spec.ts`
  - Mock `@line/liff` (init, login, isLoggedIn, isInClient), mock `navigator.userAgent` and `navigator.maxTouchPoints`, mock `window.location`
  - Property: for all inputs where `isBugCondition(input)` is true (mobile UA or maxTouchPoints > 1), calling `login()` should set `window.location.href` to `line://app/${LIFF_ID}` and NOT call `liff.login()`
  - Run test on UNFIXED code — expect FAILURE (liff.login() is called instead of deep link)
  - Document counterexamples found (e.g., "iPhone UA → liff.login() called instead of window.location.href = line://app/...")
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** — 桌面瀏覽器 login() 維持 liff.login({ redirectUri }) 流程
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: desktop UA (no iPhone/iPad/iPod/Android, maxTouchPoints ≤ 1) → `liff.login({ redirectUri })` is called on unfixed code
  - Observe: standalone mode → redirectUri = `origin`; normal mode → redirectUri = `origin + pathname`
  - Write property-based test: for all non-mobile inputs (desktop UAs, maxTouchPoints ≤ 1), `liff.login()` is called with correct `{ redirectUri }` and `window.location.href` is NOT changed to a deep link
  - Test file: same `src/composables/__tests__/useLiff.login.spec.ts`
  - Verify test passes on UNFIXED code
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Fix for 行動裝置 LINE 登入開新視窗問題

  - [x] 3.1 Implement the fix in `src/composables/useLiff.ts`
    - Add mobile device detection: `const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;`
    - Add mobile branch: if `isMobile`, set `window.location.href = \`line://app/${LIFF_ID}\`` and return early
    - Keep existing desktop branch unchanged: `liff.login({ redirectUri })`
    - Total change: ~5 lines added to `login()` function
    - _Bug_Condition: isBugCondition(input) where input is mobile UA or maxTouchPoints > 1_
    - _Expected_Behavior: mobile → window.location.href = "line://app/{LIFF_ID}", no liff.login() call_
    - _Preservation: desktop → liff.login({ redirectUri }) unchanged_
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** — 行動裝置使用深層連結登入
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** — 桌面流程未受影響
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [-] 4. Checkpoint — Type-check, lint, and ensure all tests pass
  - Run `npm run type-check` to verify no TypeScript errors
  - Run `npm run lint` to verify no lint issues
  - Run `npm run test` to verify all property tests pass
  - Ensure all tests pass, ask the user if questions arise.
