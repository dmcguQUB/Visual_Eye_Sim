//app-routing-module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseStudyPageComponent } from './components/pages/case-study-page/case-study-page.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CaseStudyDetailComponent } from './components/pages/case-study-detail/case-study-detail.component'; // Adjust the path as needed
import { PupilReflexesTestComponent } from './components/pages/pupil-reflexes-test/pupil-reflexes-test.component';


const routes: Routes = [
  //home route
  {path: '',component:HomeComponent},
  {path: 'case-study/:id', component: CaseStudyPageComponent},
  { path: 'case-study-detail/:id', component: CaseStudyDetailComponent },
  { path: 'pupil-reflexes-test/:id', component: PupilReflexesTestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
