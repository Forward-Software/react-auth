import { createEventEmitter, EventKey, EventReceiver } from './eventEmitter';

type AuthTokens = {};

type AuthCredentials = {};

type AuthEventsMap<E extends Error> = {
  initSuccess: undefined;

  initFailed: E;

  loginStarted: undefined;

  loginSuccess: undefined;

  loginFailed: E;

  refreshStarted: undefined;

  refreshSuccess: undefined;

  refreshFailed: E;

  logoutStarted: undefined;

  logoutSuccess: undefined;

  logoutFailed: E;
};

type SubscribeFn = () => void;

type UnsubscribeFn = () => boolean;

type AuthClientState<T> = {
  isAuthenticated: boolean;

  isInitialized: boolean;

  tokens: Partial<T>;
};

export abstract class BaseAuthClient<
  T = AuthTokens,
  C = AuthCredentials,
  E extends Error = Error
> {
  private _state: Readonly<AuthClientState<T>> = {
    isAuthenticated: false,
    isInitialized: false,
    tokens: {},
  };

  private eventEmitter = createEventEmitter<AuthEventsMap<E>>();

  private subscribers: Set<SubscribeFn> = new Set();

  //
  // Getters
  //

  public get isInitialized() {
    return this._state.isInitialized;
  }

  public get isAuthenticated() {
    return this._state.isAuthenticated;
  }

  public get tokens() {
    return this._state.tokens;
  }

  //
  // Public methods
  //

  public async init(): Promise<boolean> {
    try {
      await this.onInit();

      this.setState({
        isInitialized: true,
      });

      this.emit('initSuccess', undefined);
    } catch (error) {
      this.setState({
        isInitialized: false,
      });

      this.emit('initFailed', error as E);
    }

    await this.onPostInit?.();

    return this.isInitialized;
  }

  public async login(credentials?: C): Promise<boolean> {
    this.emit('loginStarted', undefined);

    await this.onPreLogin?.();

    let isSuccess: boolean = false;

    try {
      const tokens = await this.onLogin(credentials);

      this.setState({
        isAuthenticated: true,
        tokens,
      });

      this.emit('loginSuccess', undefined);

      isSuccess = true;
    } catch (err) {
      this.setState({
        isAuthenticated: false,
        tokens: {},
      });

      this.emit('loginFailed', err as E);

      isSuccess = false;
    }

    await this.onPostLogin?.(isSuccess);

    return this.isAuthenticated;
  }

  public async refresh(minValidity?: number): Promise<boolean> {
    this.emit('refreshStarted', undefined);

    await this.onPreRefresh?.();

    let isSuccess: boolean = false;

    try {
      const tokens = await this.onRefresh(minValidity);

      this.setState({
        isAuthenticated: true,
        tokens,
      });

      this.emit('refreshSuccess', undefined);

      isSuccess = true;
    } catch (err) {
      this.setState({
        isAuthenticated: false,
        tokens: {},
      });

      this.emit('refreshFailed', err as E);

      isSuccess = false;
    }

    await this.onPostRefresh?.(isSuccess);

    return this.isAuthenticated;
  }

  public async logout(): Promise<void> {
    this.emit('logoutStarted', undefined);

    await this.onPreLogout?.();

    let isSuccess: boolean = false;

    try {
      await this.onLogout();

      this.setState({
        isAuthenticated: false,
        tokens: {},
      });

      this.emit('logoutSuccess', undefined);

      isSuccess = true;
    } catch (err) {
      this.emit('logoutFailed', err as E);

      isSuccess = false;
    }

    await this.onPostLogout?.(isSuccess);
  }

  public on<K extends EventKey<AuthEventsMap<E>>>(
    eventName: K,
    listener: EventReceiver<AuthEventsMap<E>[K]>
  ): void {
    this.eventEmitter.on(eventName, listener);
  }

  public off<K extends EventKey<AuthEventsMap<E>>>(
    eventName: K,
    listener: EventReceiver<AuthEventsMap<E>[K]>
  ): void {
    this.eventEmitter.off(eventName, listener);
  }

  // Should be declared like this to avoid binding issues when used by useSyncExternalStore
  public subscribe = (subscription: SubscribeFn): UnsubscribeFn => {
    this.subscribers.add(subscription);

    return () => this.subscribers.delete(subscription);
  };

  // Should be declared like this to avoid binding issues when used by useSyncExternalStore
  public getSnapshot = (): AuthClientState<T> => {
    return this._state;
  };

  //
  // Protected methods
  //

  protected setState(stateUpdate: Partial<AuthClientState<T>>): void {
    this._state = {
      ...this._state,
      ...stateUpdate,
    };

    this.notifySubscribers();
  }

  //
  // Private methods
  //

  private emit<K extends EventKey<AuthEventsMap<E>>>(
    eventName: K,
    error: AuthEventsMap<E>[K]
  ): void {
    this.eventEmitter.emit(eventName, error);
  }

  private notifySubscribers() {
    this.subscribers.forEach(s => {
      try {
        s();
      } catch {}
    });
  }

  //
  // Abstract methods
  //

  protected abstract onInit(): Promise<void>;

  protected onPostInit?(): Promise<void>;

  protected onPreLogin?(): Promise<void>;

  protected abstract onLogin(credentials?: C): Promise<T>;

  protected onPostLogin?(isSuccess: boolean): Promise<void>;

  protected onPreRefresh?(): Promise<void>;

  protected abstract onRefresh(minValidity?: number): Promise<T>;

  protected onPostRefresh?(isSuccess: boolean): Promise<void>;

  protected onPreLogout?(): Promise<void>;

  protected abstract onLogout(): Promise<void>;

  protected onPostLogout?(isSuccess: boolean): Promise<void>;
}
