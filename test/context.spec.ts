import { renderHook } from '@testing-library/react-hooks';

import { createMockAuthClient } from './test-utils';

import { createAuth } from '../src';

afterEach(require('@testing-library/react').cleanup);

describe('createAuth', () => {
  it('should return a new ReactAuth with initialized values', () => {
    const rcContext = createAuth(createMockAuthClient());

    expect(rcContext).toBeDefined();
    expect(rcContext.AuthProvider).toBeDefined();
    expect(rcContext.useAuthClient).toBeDefined();
  });

  describe('useAuthClient hook', () => {
    it('should throw error if used outside AuthProvider context', async () => {
      const { useAuthClient } = createAuth(createMockAuthClient());

      const { result } = renderHook(() => useAuthClient());

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(
        'useAuthClient hook should be used inside AuthProvider'
      );
    });
  });
});
