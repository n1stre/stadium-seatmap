type StateKey = string;
type State = Record<StateKey, any>;
type ListenerMeta = Record<string, string | number | Date | boolean>;
type ListenerFunc<T> = (state: T, meta?: ListenerMeta) => void;
type WatchKeys<T> = Array<keyof T | "*">;
type ListenersPerKey<T> = Partial<Record<keyof T, ListenerFunc<T>[]>>;

export type ObservableState<T> = {
  state: T;
  getState: () => T;
  getInfo: () => {
    state: T;
    listenersPerKey: ListenersPerKey<T>;
    listenersGlobal: ListenerFunc<T>[];
  };
  getDiff: (partialState: Partial<T>) => Array<keyof T>;
  setState: (cb: (state: T) => Partial<T>, meta?: ListenerMeta) => void;
  subscribe: (func: ListenerFunc<T>, keys?: WatchKeys<T>) => () => void;
  reset: () => void;
};

export default function createObservableState<T extends State>(
  initialState: T
): ObservableState<T> {
  let state = initialState;
  let listenersGlobal: ListenerFunc<T>[] = [];
  let listenersPerKey: ListenersPerKey<T> = {};

  function getState() {
    return state;
  }

  function getInfo() {
    return { state, listenersPerKey, listenersGlobal };
  }

  function getDiff(partialState: Partial<T>): Array<keyof T> {
    return Object.keys(partialState).filter((key: keyof T) => {
      const newValue = partialState[key];
      const prevValue = state[key];
      return prevValue !== newValue;
    });
  }

  function setState(cb: (state: T) => Partial<T>, meta?: ListenerMeta) {
    const newStatePartial = cb(state);
    const changedKeys = getDiff(newStatePartial);
    state = { ...state, ...newStatePartial };
    listenersGlobal.forEach((l) => l(state, meta));
    changedKeys.forEach((key) => {
      listenersPerKey[key]?.forEach((l) => l(state, meta));
    });
  }

  function reset() {
    listenersGlobal = [];
    listenersPerKey = {};
    state = initialState;
  }

  function subscribe(func: ListenerFunc<T>, keys?: WatchKeys<T>) {
    if (!keys || keys.includes("*")) return subscribeGlobal(func);
    return subscribeToKeys(func, keys);
  }

  function subscribeGlobal(func: ListenerFunc<T>) {
    listenersGlobal.push(func);
    return () => unsubscribeGlobal(func);
  }

  function unsubscribeGlobal(func: ListenerFunc<T>) {
    listenersGlobal = listenersGlobal.filter((l) => l !== func);
  }

  function subscribeToKeys(func: ListenerFunc<T>, keys: WatchKeys<T>) {
    keys.forEach((key) => {
      listenersPerKey[key] ||= [];
      listenersPerKey[key]?.push(func);
    });
    return () => unsubscribeFromKeys(func, keys);
  }

  function unsubscribeFromKeys(func: ListenerFunc<T>, keys: WatchKeys<T>) {
    keys.forEach((key) => {
      listenersPerKey[key] ||= [];
      listenersPerKey[key] = listenersPerKey[key]?.filter((l) => l !== func);
    });
  }

  return {
    state,
    getState,
    getInfo,
    getDiff,
    setState,
    subscribe,
    reset,
  };
}
