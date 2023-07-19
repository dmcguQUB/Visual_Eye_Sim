import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared';
import { Auth0HomeComponent } from './auth0-home.component';

@NgModule({
  declarations: [Auth0HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: 'auth0', component: Auth0HomeComponent }]),
  ],
})
export class Auth0HomeModule {}
