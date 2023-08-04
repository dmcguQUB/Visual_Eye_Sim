//frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { CaseStudyDetailComponent } from './components/pages/case-study-detail/case-study-detail.component'; // Adjust the path as needed
import { PupilReflexesTestComponent } from './components/pages/pupil-reflexes-test/pupil-reflexes-test.component';
import { VisualFieldsTestLeftComponent } from './components/pages/visual-fields-test-left/visual-fields-test-left.component'; // visual fields test by confrontation imported route
import { VisualAcuityTestComponent } from './components/pages/visual-acuity-test/visual-acuity-test.component'; //visual acuity test
import { EyeMovementsTestComponent } from './components/pages/eye-movements-test/eye-movements-test.component'; //eye movemebts
import { DirectOphthalmoscopyTestComponent } from './components/pages/direct-ophthalmoscopy-test/direct-ophthalmoscopy-test.component';
import { QuestionComponent } from './components/pages/question/question.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { ScoresComponent } from './components/pages/scores/scores.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { VisualFieldsTestRightComponent } from './components/pages/visual-fields-test-right/visual-fields-test-right.component';
import { AdminAvgScoreVsTimeComponent } from './components/pages/admin-avg-score-vs-time/admin-avg-score-vs-time.component';
import { AdminRegistrationsOverTimeComponent } from './components/pages/admin-registrations-over-time/admin-registrations-over-time.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/admin.guard';
import { TestVisualFieldsTestComponent } from './components/pages/test-visual-fields-test/test-visual-fields-test.component';
import { UserscoreScoreOverTimeComponent } from './components/pages/userscore-score-over-time/userscore-score-over-time.component';

const routes: Routes = [
  //home route
  { path: '', component: HomeComponent },
  {
    path: 'case-study-detail/:useCaseId',
    component: CaseStudyDetailComponent,
    canActivate: [AuthGuard],
  }, // protect route
  {
    path: 'pupil-reflexes-test/:useCaseId',
    component: PupilReflexesTestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'visual-fields-test-left/:useCaseId',
    component: VisualFieldsTestLeftComponent,
    canActivate: [AuthGuard],
  }, // adding route to the routes array
  {
    path: 'visual-fields-test-right/:useCaseId',
    component: VisualFieldsTestRightComponent,
    canActivate: [AuthGuard],
  }, // adding route to the routes array
  {
    path: 'visual-acuity-test/:useCaseId',
    component: VisualAcuityTestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'eye-movements-test/:useCaseId',
    component: EyeMovementsTestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'test',
    component: TestVisualFieldsTestComponent,
  },
  {
    path: 'direct-ophthalmoscopy-test/:useCaseId',
    component: DirectOphthalmoscopyTestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'welcome/:useCaseId',
    component: WelcomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'question/:useCaseId',
    component: QuestionComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'scores', component: ScoresComponent, canActivate: [AuthGuard] },
  //can only access if authenticated and admin
  { path: 'admin', component: AdminPageComponent, canActivate: [AuthGuard,AdminGuard] },
    //can only access if authenticated and admin
  {
    path: 'admin-avg-score-vs-time',
    component: AdminAvgScoreVsTimeComponent,
    canActivate: [AuthGuard,AdminGuard],
  },
    //can only access if authenticated and admin
  {
    path: 'admin-registrations-over-time',
    component: AdminRegistrationsOverTimeComponent,
    canActivate: [AuthGuard,AdminGuard],
  },
  {
    path: 'userscore-score-over-time',
    component: UserscoreScoreOverTimeComponent,
    canActivate: [AuthGuard,AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
