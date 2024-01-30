"use client";
import React from "react";
import type { ObservableState } from "./ObservableState";

function useObservableState<T>(
  observable: ObservableState<T>,
  keys: Array<keyof T | "*"> = []
) {
  const [state, setState] = React.useState(() => observable.getState());

  React.useEffect(() => {
    setState(observable.getState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!keys.length) return;
    return observable.subscribe(setState, keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, keys);

  return state;
}

export default useObservableState;
