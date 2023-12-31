//frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { CaseStudyDetailComponent } from './components/pages/case-study-detail/case-study-detail.component'; // Adjust the path as needed
import { PupilReflexesTestComponent } from './components/pages/eye-tests/pupil-reflexes-test/pupil-reflexes-test.component';
import { VisualFieldsTestLeftComponent } from './components/pages/eye-tests/visual-fields-all/visual-fields-test-left/visual-fields-test-left.component'; // visual fields test by confrontation imported route
import { VisualAcuityTestComponent } from './components/pages/eye-tests/visual-acuity-test/visual-acuity-test.component'; //visual acuity test
import { EyeMovementsTestComponent } from './components/pages/eye-tests/eye-movements-test/eye-movements-test.component'; //eye movemebts
import { DirectOphthalmoscopyTestComponent } from './components/pages/eye-tests/direct-opthamaloscopy/direct-ophthalmoscopy-test/direct-ophthalmoscopy-test.component';
import { WelcomeComponent } from './components/pages/QA/welcome/welcome.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { VisualFieldsTestRightComponent } from './components/pages/eye-tests/visual-fields-all/visual-fields-test-right/visual-fields-test-right.component';
import { AdminRegistrationsOverTimeComponent } from './components/pages/graphs/admin/admin-registrations-over-time/admin-registrations-over-time.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserProfilePageComponent } from './components/pages/user-profile-page/user-profile-page.component';
import { EyeTestQuestionsComponent } from './components/pages/QA/abstract-test/eye-test-questions/eye-test-questions.component';
import { DiagnosisQuestionsComponent } from './components/pages/QA/abstract-test/diagnosis-questions/diagnosis-questions.component';
import { InvestigationsQuestionsComponent } from './components/pages/QA/abstract-test/investigations-questions/investigations-questions.component';
import { DirectOphthalmoscopyTestRightComponent } from './components/pages/eye-tests/direct-opthamaloscopy/direct-ophthalmoscopy-test-right/direct-ophthalmoscopy-test-right.component';
import { UserScoresOverTimeGraphComponent } from './components/pages/graphs/user/user-scores-over-time-graph/user-scores-over-time-graph.component';
import { UserCaseStudyCorrectVsOncorrectComponent } from './components/pages/graphs/user/user-case-study-correct-vs-oncorrect/user-case-study-correct-vs-oncorrect.component';
import { UserCaseStudyQuestionTypeCorrectVsIncorrectComponent } from './components/pages/graphs/user/user-case-study-question-type-correct-vs-incorrect/user-case-study-question-type-correct-vs-incorrect.component';
import { AdminCaseStudyCorrectVsIncorrectComponent } from './components/pages/graphs/admin/admin-case-study-correct-vs-incorrect/admin-case-study-correct-vs-incorrect.component';
import { AdminAvgScoreOverTimeComponent } from './components/pages/graphs/admin/admin-global-avg-score-over-time/admin-avg-score-over-time.component';
import { UserScoresComponent } from './components/pages/graphs/user/user-scores/user-scores.component';
import { InvestigationsReportComponent } from './components/pages/investigations-report/investigations-report.component';

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
    path: 'direct-ophthalmoscopy-test-left/:useCaseId',
    component: DirectOphthalmoscopyTestComponent,
    canActivate: [AuthGuard],
  },{
  path: 'direct-ophthalmoscopy-test-right/:useCaseId',
  component: DirectOphthalmoscopyTestRightComponent,
  canActivate: [AuthGuard],
},
  {
    path: 'welcome/:useCaseId',
    component: WelcomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'eye-test-questions/:useCaseId',
    component: EyeTestQuestionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'diagnosis-questions/:useCaseId',
    component: DiagnosisQuestionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'investigations-questions/:useCaseId',
    component: InvestigationsQuestionsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  ///user-scores.component 
    //can only access if authenticated and admin
    {
      path: 'user-scores',
      component: UserScoresComponent,
      canActivate: [AuthGuard],
    },
  {
    path: 'admin-registrations-over-time',
    component: AdminRegistrationsOverTimeComponent,
    canActivate: [AuthGuard,AdminGuard],
  },

  {
    path: 'admin-avg-score-over-time',
    component: AdminAvgScoreOverTimeComponent,
    canActivate: [AuthGuard,AdminGuard],
  },
  {
    path: 'admin-case-study-correct-vs-incorrect',
    component: AdminCaseStudyCorrectVsIncorrectComponent,
    canActivate: [AuthGuard,AdminGuard],
  },
  {
    path: 'user-scores-over-time-graph',
    component: UserScoresOverTimeGraphComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-case-study-correct-vs-oncorrect',
    component: UserCaseStudyCorrectVsOncorrectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-case-study-question-type-correct-vs-incorrect',
    component: UserCaseStudyQuestionTypeCorrectVsIncorrectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-profile-page',
    component: UserProfilePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'investigations-report',
    component: InvestigationsReportComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
