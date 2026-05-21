import { describe, it, expect, vi } from 'vitest';

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

vi.mock('@/composables/shared/usePwaAuthBridge', () => ({
  isStandaloneMode: () => false,
  broadcastTokenReady: vi.fn(),
  isLiffCallback: () => false,
}));

describe('Debug: check login behavior on unfixed code', () => {
  it('should call liff.login on mobile UA (unfixed code has this bug)', async () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    });

    const { useLiff } = await import('@/composables/useLiff');
    const { init, login } = useLiff();
    await init();
    login();

    // On unfixed code, liff.login() IS called (that's the bug)
    console.log('liff.login called:', mockLiffLogin.mock.calls.length);
    console.log('liff.login args:', JSON.stringify(mockLiffLogin.mock.calls));
    expect(mockLiffLogin).toHaveBeenCalled();
  });
});
