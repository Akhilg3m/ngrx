import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter.reducer';
import { CounterComponent } from './counter.component';

@NgModule({
  declarations: [CounterComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('counter', counterReducer)
  ],
  exports: [CounterComponent]
})
export class CounterModule {}
