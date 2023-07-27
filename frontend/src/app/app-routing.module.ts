//frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { CaseStudyDetailComponent } from './components/pages/case-study-detail/case-study-detail.component'; // Adjust the path as needed
import { PupilReflexesTestComponent } from './components/pages/pupil-reflexes-test/pupil-reflexes-test.component';
import { VisualFieldsTestLeftComponent } from './components/pages/visual-fields-test-left/visual-fields-test-left.component'; // visual fields test by confrontation imported route
import { VisualAcuityTestComponent } from './components/pages/visual-acuity-test/visual-acuity-test.component';//visual acuity test
import { EyeMovementsTestComponent } from './components/pages/eye-movements-test/eye-movements-test.component'; //eye movemebts
import { DirectOphthalmoscopyTestComponent } from './components/pages/direct-ophthalmoscopy-test/direct-ophthalmoscopy-test.component';
import { QuestionComponent } from './components/pages/question/question.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { ScoresComponent } from './components/pages/scores/scores.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { VisualFieldsTestRightComponent } from './components/pages/visual-fields-test-right/visual-fields-test-right.component';

const routes: Routes = [
  //home route
  {path: '',component:HomeComponent},
  { path: 'case-study-detail/:useCaseId', component: CaseStudyDetailComponent },
  { path: 'pupil-reflexes-test/:useCaseId', component: PupilReflexesTestComponent },
  { path: 'visual-fields-test-left/:useCaseId', component: VisualFieldsTestLeftComponent }, // adding route to the routes array
  { path: 'visual-fields-test-right/:useCaseId', component: VisualFieldsTestRightComponent }, // adding route to the routes array
  { path: 'visual-acuity-test/:useCaseId', component: VisualAcuityTestComponent }, 
  { path: 'eye-movements-test/:useCaseId', component: EyeMovementsTestComponent },
  { path: 'direct-ophthalmoscopy-test/:useCaseId', component: DirectOphthalmoscopyTestComponent },
  { path: 'welcome/:useCaseId', component: WelcomeComponent },
  { path: 'question/:useCaseId', component: QuestionComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'scores', component: ScoresComponent },
  { path: 'admin', component: AdminPageComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
