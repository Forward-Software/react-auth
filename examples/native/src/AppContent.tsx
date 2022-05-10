import * as React from 'react';
import { DependencyList, FC, useCallback, useState } from 'react';
import { Button, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthClient } from './auth';

function useUserCredentials() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const updateUsername = useCallback((param: string) => {
    setUsername(param);
  }, []);
  const updatePassword = useCallback((param: string) => {
    setPassword(param);
  }, []);

  return {
    username,
    password,
    updateUsername,
    updatePassword,
  };
}

function useAsyncCallback<T extends (...args: never[]) => Promise<unknown>>(
  callback: T,
  deps: DependencyList
): [T, boolean] {
  const [isLoading, setLoading] = useState(false);

  const cb = useCallback(async (...argsx: never[]) => {
    setLoading(true);
    const res = await callback(...argsx);
    setLoading(false);
    return res;
  }, deps) as T;

  return [cb, isLoading];
}

const AppContent: FC = () => {
  const client = useAuthClient();
  const userCredentials = useUserCredentials();

  const [onLogin, isLoginLoading] = useAsyncCallback(
    () =>
      client.login({
        username: userCredentials.username,
        password: userCredentials.password,
      }),
    [client, userCredentials]
  );

  const [onLogout, isLogoutLoading] = useAsyncCallback(
    () => client.logout(),
    [client]
  );

  const [onRefreshTokens, tokenRefreshLoading] = useAsyncCallback(
    () => client.refresh(),
    [client]
  );

  return (
    <SafeAreaView>
      <ScrollView
        style={{ paddingTop: 50 }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <Text>Auth client ready? {String(client.isInitialized)}</Text>
        <Text>Auth client authenticated? {String(client.isAuthenticated)}</Text>

        <View style={{ marginTop: 20 }}>
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            value={userCredentials.username}
            onChangeText={userCredentials.updateUsername}
            style={{
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Insert username"
          />
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            value={userCredentials.password}
            onChangeText={userCredentials.updatePassword}
            style={{
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 1,
              marginTop: 15,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Insert password"
          />
        </View>

        <View>
          <Button
            onPress={onLogin}
            disabled={client.isAuthenticated || isLoginLoading}
            title="Login"
          />

          <Button
            onPress={onLogout}
            disabled={!client.isAuthenticated || isLogoutLoading}
            title="Logout"
          />
        </View>

        {isLoginLoading ? <Text>Login in progress...</Text> : null}

        <Text>Tokens:</Text>
        <Text>
          {tokenRefreshLoading
            ? 'Refeshing tokens....'
            : JSON.stringify(client.tokens ?? {}, null, 2)}
        </Text>

        {/* 
          use client.refresh() where you implement your API calls logic (eg. redux-saga, ....)
          check code in src/api/interceptors.ts and use APIClient to make call to API
        */}
        <Button
          onPress={onRefreshTokens}
          disabled={!client.isAuthenticated || tokenRefreshLoading}
          title="Refresh tokens"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppContent;
