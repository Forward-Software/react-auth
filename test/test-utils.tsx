/* istanbul ignore file */

import * as React from 'react';

import { BaseAuthClient } from '../src';

type MockTokens = {
  authToken: string;

  refreshToken: string;
};

type MockCredentials = {
  username: string;

  password: string;
};

class MockAuthClient extends BaseAuthClient<MockTokens, MockCredentials> {
  onInit(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  onLogin(_credentials?: MockCredentials): Promise<MockTokens> {
    throw new Error('Method not implemented.');
  }

  onRefresh(_minValidity?: number): Promise<MockTokens> {
    throw new Error('Method not implemented.');
  }

  onLogout(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export const createMockAuthClient = () => {
  return new MockAuthClient();
};

export const createChild = (useAuthClientHook: () => MockAuthClient) => {
  return function() {
    const authClient = useAuthClientHook();
    return (
      <div data-testid="authClient">
        authClient: {!!authClient ? 'present' : 'absent'}
      </div>
    );
  };
};

export const flushPromises = () => new Promise(setImmediate);
