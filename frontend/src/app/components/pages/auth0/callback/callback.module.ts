import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { CallbackComponent } from './callback.component';
import { CallbackRoutingModule } from './callback-routing.module';

@NgModule({
  declarations: [CallbackComponent],
  imports: [CommonModule, SharedModule, CallbackRoutingModule],
})
export class CallbackModule {}