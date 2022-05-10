import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { Axios } from 'axios';
import isJwtTokenExpired from 'jwt-check-expiry';
import { BaseAuthClient } from '@forward-software/react-auth';
import { BASE_URL } from '../constants';

type Tokens = Partial<{
  accessToken: string;
  refreshToken: string;
}>;

type Credentials = {
  username: string;
  password: string;
};

class Client extends BaseAuthClient<Tokens, Credentials> {
  private AxiosClient!: Axios;

  protected async onInit(): Promise<void> {
    this.AxiosClient = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // get tokens from persisted state (AsyncStorage....)
    const tokens = await AsyncStorage.getItem('tokens');

    if (tokens) {
      this.setState({
        isAuthenticated: true,
        tokens: JSON.parse(tokens),
      });
    }
  }

  protected async onLogin(credentials?: Credentials): Promise<Tokens> {
    // Replace auth/login with your url without the domain
    const payload = await this.AxiosClient.post('auth/login', {
      username: credentials?.username,
      password: credentials?.password,
    });

    AsyncStorage.setItem('tokens', JSON.stringify(payload.data.data));
    return payload.data.data;
  }

  protected async onRefresh(): Promise<Tokens> {
    if (
      !!this.tokens.accessToken &&
      !isJwtTokenExpired(this.tokens.accessToken)
    )
      return this.tokens;

    const payload = await this.AxiosClient.post(
      // Replace jwt/refresh with your url without the domain
      'jwt/refresh',
      {
        refreshToken: this.tokens.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${this.tokens.accessToken}`,
        },
      }
    );

    AsyncStorage.setItem('tokens', JSON.stringify(payload.data.data));
    return payload.data.data;
  }

  protected onLogout(): Promise<void> {
    AsyncStorage.removeItem('tokens');
    // If you need to call an API to logout, just use the onLogin code to do your stuff
    return Promise.resolve();
  }
}

export default Client;
