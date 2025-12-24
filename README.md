# NgRx Counter - A Simple Learning Guide

A minimal NgRx example with just **increment** and **decrement**. Perfect for understanding the core concepts.

---

## What is NgRx?

NgRx is a **state management** library. Instead of storing data in components, you store it in a central **Store** that all components can access.

```
Without NgRx:  Component A has data, Component B has different data... chaos!
With NgRx:     ONE Store holds ALL data. Components just read from it.
```

---

## The Flow (Super Simple)

```
┌──────────────────────────────────────────────────────────┐
│                     COMPONENT                             │
│               User clicks "+" button                      │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ Step 1: Dispatch ACTION
                          ▼
┌──────────────────────────────────────────────────────────┐
│                       ACTION                              │
│              "Hey, user wants to increment!"              │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ Step 2: Reducer receives action
                          ▼
┌──────────────────────────────────────────────────────────┐
│                      REDUCER                              │
│           Takes old state, returns NEW state              │
│              { count: 0 } → { count: 1 }                  │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ Step 3: Store updates
                          ▼
┌──────────────────────────────────────────────────────────┐
│                       STORE                               │
│              Holds the current state                      │
│                   { count: 1 }                            │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ Step 4: Selector extracts data
                          ▼
┌──────────────────────────────────────────────────────────┐
│                     SELECTOR                              │
│              "Give me just the count"                     │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ Step 5: Component updates
                          ▼
┌──────────────────────────────────────────────────────────┐
│                     COMPONENT                             │
│                  Shows "Count: 1"                         │
└──────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
src/app/counter/
├── counter.state.ts      ← Defines the data shape
├── counter.actions.ts    ← Defines what can happen
├── counter.reducer.ts    ← Handles state changes
├── counter.selectors.ts  ← Extracts data from store
├── counter.facade.ts     ← Clean API for components
├── counter.component.ts  ← The UI
└── counter.module.ts     ← Wires everything together
```

---

## Step-by-Step: What Happens When You Click "+"

### Step 1: Component Calls Facade

```typescript
// counter.component.ts
<button (click)="increment()">+</button>

increment() {
  this.facade.increment();
}
```

The component doesn't know about NgRx. It just calls a method.

---

### Step 2: Facade Dispatches Action

```typescript
// counter.facade.ts
increment() {
  this.store.dispatch(CounterActions.increment());
}
```

The facade sends a message to the store: "Increment please!"

---

### Step 3: Action is Just a Message

```typescript
// counter.actions.ts
export const increment = createAction('[Counter] Increment');
```

Actions are simple objects. They describe WHAT happened, not HOW to handle it.

---

### Step 4: Reducer Creates New State

```typescript
// counter.reducer.ts
on(CounterActions.increment, state => ({
  ...state,
  count: state.count + 1
}))
```

The reducer is a **pure function**:
- Takes current state + action
- Returns NEW state (never modifies the old one)

```
Before: { count: 0 }
After:  { count: 1 }
```

---

### Step 5: Selector Extracts Data

```typescript
// counter.selectors.ts
export const selectCount = createSelector(
  selectCounterState,
  state => state.count
);
```

Selectors are efficient queries. They only return what you need.

---

### Step 6: Component Displays New Value

```typescript
// counter.component.ts
count$ = this.facade.count$;

// Template
<h2>Count: {{ count$ | async }}</h2>
```

The `async` pipe subscribes to changes. When count updates, the UI updates automatically.

---

## The Files Explained

### 1. State - What data do we store?

```typescript
// counter.state.ts
export interface CounterState {
  count: number;
}

export const initialCounterState: CounterState = {
  count: 0
};
```

---

### 2. Actions - What can happen?

```typescript
// counter.actions.ts
export const increment = createAction('[Counter] Increment');
export const decrement = createAction('[Counter] Decrement');
```

---

### 3. Reducer - How does state change?

```typescript
// counter.reducer.ts
export const counterReducer = createReducer(
  initialCounterState,
  on(CounterActions.increment, state => ({
    ...state,
    count: state.count + 1
  })),
  on(CounterActions.decrement, state => ({
    ...state,
    count: state.count - 1
  }))
);
```

---

### 4. Selectors - How do we read state?

```typescript
// counter.selectors.ts
export const selectCounterState = createFeatureSelector<CounterState>('counter');

export const selectCount = createSelector(
  selectCounterState,
  state => state.count
);
```

---

### 5. Facade - Clean API for components

```typescript
// counter.facade.ts
@Injectable({ providedIn: 'root' })
export class CounterFacade {
  count$ = this.store.select(CounterSelectors.selectCount);

  constructor(private store: Store) {}

  increment() {
    this.store.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }
}
```

---

### 6. Component - The UI

```typescript
// counter.component.ts
@Component({
  selector: 'app-counter',
  template: `
    <h2>Count: {{ count$ | async }}</h2>
    <button (click)="decrement()">-</button>
    <button (click)="increment()">+</button>
  `
})
export class CounterComponent {
  count$ = this.facade.count$;

  constructor(private facade: CounterFacade) {}

  increment() { this.facade.increment(); }
  decrement() { this.facade.decrement(); }
}
```

---

## Key Concepts

| Concept | One-Line Explanation |
|---------|---------------------|
| **Store** | Single place where all data lives |
| **Action** | A message saying what happened |
| **Reducer** | Pure function that creates new state |
| **Selector** | Query to get specific data from store |
| **Facade** | Hides NgRx details from components |

---

## The Golden Rules

1. **State is read-only** - Never modify state directly
2. **Reducers are pure** - Same input = same output, no side effects
3. **One-way data flow** - Action → Reducer → Store → Component

---

## Run the App

```bash
npm install
npm start
```

Open http://localhost:4200

Install [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools) to see state changes!

---

## What's Next?

Once you understand this, you can learn:
- **Effects** - For API calls and async operations
- **Entity** - For managing collections (lists of items)
- **Router Store** - For syncing URL with state
