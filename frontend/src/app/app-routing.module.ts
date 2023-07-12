//frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseStudyPageComponent } from './components/pages/case-study-page/case-study-page.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CaseStudyDetailComponent } from './components/pages/case-study-detail/case-study-detail.component'; // Adjust the path as needed
import { PupilReflexesTestComponent } from './components/pages/pupil-reflexes-test/pupil-reflexes-test.component';
import { VisualFieldsTestComponent } from './components/pages/visual-fields-test/visual-fields-test.component'; // visual fields test by confrontation imported route
import { VisualAcuityTestComponent } from './components/pages/visual-acuity-test/visual-acuity-test.component';//visual acuity test
import { EyeMovementsTestComponent } from './components/pages/eye-movements-test/eye-movements-test.component'; //eye movemebts
import { DirectOphthalmoscopyTestComponent } from './components/pages/direct-ophthalmoscopy-test/direct-ophthalmoscopy-test.component';
import { QuestionComponent } from './components/pages/question/question.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';


const routes: Routes = [
  //home route
  {path: '',component:HomeComponent},
  {path: 'case-study/:useCaseId', component: CaseStudyPageComponent},
  { path: 'case-study-detail/:id', component: CaseStudyDetailComponent },
  { path: 'pupil-reflexes-test/:id', component: PupilReflexesTestComponent },
  { path: 'visual-fields-test/:id', component: VisualFieldsTestComponent }, // adding route to the routes array
  { path: 'visual-acuity-test/:id', component: VisualAcuityTestComponent }, 
  { path: 'eye-movements-test/:id', component: EyeMovementsTestComponent },
  { path: 'direct-ophthalmoscopy-test/:id', component: DirectOphthalmoscopyTestComponent },
  {path:"welcome", component:WelcomeComponent},
  {path:"question", component:QuestionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
