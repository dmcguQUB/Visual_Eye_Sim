//app-routing-module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseStudyPageComponent } from './components/pages/case-study-page/case-study-page.component';
import { HomeComponent } from './components/pages/home/home.component';

const routes: Routes = [
  //home route
  {path: '',component:HomeComponent},
  { path: 'case-study/:id', component: CaseStudyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
