import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CounterActions from './counter.actions';
import * as CounterSelectors from './counter.selectors';

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
