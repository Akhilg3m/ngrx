import { Component } from '@angular/core';
import { CounterFacade } from './counter.facade';

@Component({
  selector: 'app-counter',
  template: `
    <div class="counter-container">
      <h2>Count: {{ count$ | async }}</h2>

      <div class="buttons">
        <button (click)="decrement()">-</button>
        <button (click)="increment()">+</button>
      </div>
    </div>
  `,
  styles: [`
    .counter-container {
      text-align: center;
      padding: 20px;
    }
    .buttons button {
      font-size: 24px;
      padding: 10px 20px;
      margin: 0 10px;
      cursor: pointer;
    }
  `]
})
export class CounterComponent {
  count$ = this.facade.count$;

  constructor(private facade: CounterFacade) {}

  increment() {
    this.facade.increment();
  }

  decrement() {
    this.facade.decrement();
  }
}
