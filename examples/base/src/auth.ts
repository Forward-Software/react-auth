import { BaseAuthClient, createAuth } from '../../../.';

type AuthCredentials = {};

type AuthTokens = {
  authToken: string;

  refreshToken: string;
};

class MyAuthClient extends BaseAuthClient<AuthTokens, AuthCredentials> {
  protected onInit(): Promise<void> {
    return Promise.resolve();
  }

  protected onLogin(credentials?: AuthCredentials): Promise<AuthTokens> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve({
            authToken: 'auth.token',
            refreshToken: 'refresh.token',
          }),
        2000
      );
    });
  }

  protected onRefresh(minValidity?: number): Promise<AuthTokens> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve({
            authToken: 'new.auth.token',
            refreshToken: 'new.refresh.token',
          }),
        2000
      );
    });
  }

  protected onLogout(): Promise<void> {
    return Promise.resolve();
  }
}

export const authClient = new MyAuthClient();

export const { AuthProvider, useAuthClient } = createAuth(authClient);
