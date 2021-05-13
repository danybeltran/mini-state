import { useContext, createContext, useReducer, Context } from "react";

interface Global {
  app: {
    events: {};
  };
  contexts: {
    app: Context<{}>;
  };
}

const _global: Global = {
  app: {
    events: {},
  },
  contexts: {
    app: createContext<GlobalStateReturnType>({}),
  },
};

export var AppContext = _global.contexts.app;

interface GlobalStateReturnType {
  emit?: (event: string, cb: (st) => typeof st) => void;
  on?: (event: string, cb: (st) => any) => void;
  actions?: any;
}

export function useGlobalState(): GlobalStateReturnType {
  /**
   * @type { GlobalStateReturnType  }
   */
  const context = useContext<GlobalStateReturnType>(AppContext);
  return context;
}

function reduce<T>() {
  return function reducer(state: T, event: (state: T) => T) {
    return {
      ...event(state),
    };
  };
}

export function useAppReducer<T>(state: T, optionalActions?: {}) {
  const [state2, emit] = useReducer(reduce<T>(), state);
  function em(event = "", cb: (st: T) => T) {
    if (_global.app.events[event]) {
      _global.app.events[event]();
    } else {
      console.error(`No listener(s) for '${event}' event`);
    }
    emit(() => cb(state2));
  }

  function on(eventName = "", callback: (st: T) => {}) {
    _global.app.events[eventName] = () => callback(state2);
    return undefined;
  }

  const dispatchers = {};

  for (let dispatcher in optionalActions) {
    const cb = optionalActions[dispatcher];
    dispatchers[dispatcher] = () => {
      em(dispatcher, cb);
    };
  }

  const globalState: {
    state: T;
    emit: (event: string, cb: (st: T) => T) => void;
    on: (event: string, cb: (st: T) => any) => void;
    actions: any;
  } = {
    state: state2,
    emit: em,
    on,
    actions: dispatchers,
  };

  return globalState;
}
