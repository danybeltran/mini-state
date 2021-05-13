### react-mini-state

Small state managment library for React

For creating a global state:

You need to import the `useAppReducer` and `AppContext` from the library, and use `useAppReducer` at the top of your app tree.

`useAppReducer` takes two arguments, the first one is the initial state, and the second one, the (optional) methods to update it.
Take the example below
```jsx
// App.js

import { useAppReducer, AppContext } from "react-mini-state";

export default function App() {
  const global = useAppReducer(
    /* Initial state value */
    {
      count: 0,
      name: "Dany",
    },
    /* Methods for updating the state. They take the current state as the argument */
    {
      resetCount(state) {
        /* What you return in each method replaces the state, be careful */
        return {
          ...state,
          count: 0,
        };
      },
      upperCaseName(state) {
        return {
          ...state,
          name: state.name.toUpperCase(),
        };
      },
    }
  )
  /* You need to use the `AppContext.Provider` at the
  top of your app and pass the `global` value above */
  return (
      <AppContext.Provider value={global}>
        ...
        Your app
        ...
      </AppContext.Provider>
  ) 
}
```

#### How to consume it

`useAppReducer` returns an object with 3 properties:

`state` - The current state, which can be consumed as an object

`emit` - A method to let "listeners" know when an "event" is triggered (not mandatory to use this)

`on` - triggers a function when certain "events" are emited

`actions` - The object with your defined methods for updating the state

#### Using `emit` and `on`

The `emit` method takes two arguments, `event: string` and `callback: Function`

It updates the state with the return value of the `callback` argument.

Using the example above:


```jsx
<button
  onClick={() =>
    global.emit("reset", (state) => {
      return {
        ...state,
        count: 0,
      };
    })
  }
>
  Reset count
</button>
```

And trigger a callback when that specific event is triggered
```jsx
useEffect(()=>{
  global.on("reset", () => console.log("Count was reset")
},[])
```

#### With custom methods

You may also want to have methods for doing something specific, like

```jsx
function addOne(state){
    return {
        ...state,
        count: state.count + 1
    }
}

```

That can be done by passing the object with those methods as the second argument to the `useAppReducer`, like so :

```jsx
const global = useAppReducer(
  {
    count: 0,
  },
  /* Here you will add your methods */
  {
    addOne(state) {
      return {
        ...state,
        count: state.count + 1,
      };
    },
  }
);
```

To use that method:

```jsx
<button onClick={global.actions.addOne}>+</button>
```

> The state value will be passed automatically

#### Using external components

It is important to be able to access the state from other components. That can be done using the `useGlobalState` method:

```jsx
import { useGlobalState } from "react-mini-state";

export default function AddButton() {
  const global = useGlobalState();
  return <button onClick={global.actions.addOne}>Add one</button>;
}

```
> `state`, `emit`, `on` and `actions` are used the same as in previous examples.

#### Working on:

- Ability to create more than one provider
- Improve code suggestions