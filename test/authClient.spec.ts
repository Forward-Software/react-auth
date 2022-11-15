import * as rtl from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { createMockAuthClient } from './test-utils';

afterEach(require('@testing-library/react').cleanup);

describe('AuthClient', () => {
  describe('on Init', () => {
    it('should notify success', async () => {
      const initSuccessEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      jest.spyOn(authClientStub, 'onInit').mockResolvedValue(undefined);

      authClientStub.on('initSuccess', initSuccessEventListener);

      await rtl.act(async () => {
        await authClientStub.init();
      });

      expect(initSuccessEventListener).toHaveBeenCalledTimes(1);
    });

    it('should notify failure', async () => {
      const initFailureEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      authClientStub.on('initFailed', initFailureEventListener);

      await rtl.act(async () => {
        await authClientStub.init();
      });

      expect(initFailureEventListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('on Login', () => {
    it('should notify start', async () => {
      const loginStartedListener = jest.fn();

      const authClientStub = createMockAuthClient();
      authClientStub.on('loginStarted', loginStartedListener);

      await rtl.act(async () => {
        await authClientStub.login();
      });

      expect(loginStartedListener).toHaveBeenCalledTimes(1);
    });

    it('should notify success', async () => {
      const loginSuccessEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      jest.spyOn(authClientStub, 'onLogin').mockResolvedValue({
        authToken: 'tkn',
        refreshToken: 'tkn',
      });

      authClientStub.on('loginSuccess', loginSuccessEventListener);

      await rtl.act(async () => {
        await authClientStub.login();
      });

      expect(loginSuccessEventListener).toHaveBeenCalledTimes(1);
    });

    it('should notify failure', async () => {
      const loginFailureEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      authClientStub.on('loginFailed', loginFailureEventListener);

      await rtl.act(async () => {
        await authClientStub.login();
      });

      expect(loginFailureEventListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('on Refresh', () => {
    it('should notify start', async () => {
      const refreshStartedListener = jest.fn();

      const authClientStub = createMockAuthClient();
      authClientStub.on('refreshStarted', refreshStartedListener);

      await rtl.act(async () => {
        await authClientStub.refresh();
      });

      expect(refreshStartedListener).toHaveBeenCalledTimes(1);
    });

    it('should notify success', async () => {
      const refreshSuccessEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      jest.spyOn(authClientStub, 'onRefresh').mockResolvedValue({
        authToken: 'tkn',
        refreshToken: 'tkn',
      });

      authClientStub.on('refreshSuccess', refreshSuccessEventListener);

      await rtl.act(async () => {
        await authClientStub.refresh();
      });

      expect(refreshSuccessEventListener).toHaveBeenCalledTimes(1);
    });

    it('should notify failure', async () => {
      const refreshFailureEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      authClientStub.on('refreshFailed', refreshFailureEventListener);

      await rtl.act(async () => {
        await authClientStub.refresh();
      });

      expect(refreshFailureEventListener).toHaveBeenCalledTimes(1);
    });

    it('should NOT trigger onRefresh twice', async () => {
      const authClientStub = createMockAuthClient();
      jest.spyOn(authClientStub, 'onRefresh').mockResolvedValue({
        authToken: 'tkn',
        refreshToken: 'tkn',
      });

      await rtl.act(() => {
        authClientStub.refresh();

        authClientStub.refresh();
      });

      expect(authClientStub.onRefresh).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit refresh events twice', async () => {
      const refreshStartedListener = jest.fn();
      const refreshSuccessEventListener = jest.fn();
      const refreshFailureEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      jest.spyOn(authClientStub, 'onRefresh').mockResolvedValue({
        authToken: 'tkn',
        refreshToken: 'tkn',
      });

      authClientStub.on('refreshSuccess', refreshSuccessEventListener);
      authClientStub.on('refreshStarted', refreshStartedListener);
      authClientStub.on('refreshFailed', refreshFailureEventListener);

      await rtl.act(() => {
        authClientStub.refresh();

        authClientStub.refresh();
      });

      expect(refreshStartedListener).toHaveBeenCalledTimes(1);
      expect(refreshSuccessEventListener).toHaveBeenCalledTimes(1);
      expect(refreshFailureEventListener).toHaveBeenCalledTimes(0);
    });
  });

  describe('on logout', () => {
    it('should notify start', async () => {
      const logoutStartedListener = jest.fn();

      const authClientStub = createMockAuthClient();
      authClientStub.on('logoutStarted', logoutStartedListener);

      await rtl.act(async () => {
        await authClientStub.logout();
      });

      expect(logoutStartedListener).toHaveBeenCalledTimes(1);
    });

    it('should notify success', async () => {
      const logoutSuccessEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      jest.spyOn(authClientStub, 'onLogout').mockResolvedValue(undefined);

      authClientStub.on('logoutSuccess', logoutSuccessEventListener);

      await rtl.act(async () => {
        await authClientStub.logout();
      });

      expect(logoutSuccessEventListener).toHaveBeenCalledTimes(1);
    });

    it('should notify failure', async () => {
      const logoutFailureEventListener = jest.fn();

      const authClientStub = createMockAuthClient();
      authClientStub.on('logoutFailed', logoutFailureEventListener);

      await rtl.act(async () => {
        await authClientStub.logout();
      });

      expect(logoutFailureEventListener).toHaveBeenCalledTimes(1);
    });
  });
});
