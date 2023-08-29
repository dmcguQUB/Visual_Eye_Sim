import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
//import interceptor 
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/pages/QA/welcome/welcome.component';

import { HeaderComponent } from './components/partials/header/header.component';
import { ChangeBgDirective } from './shared/directives/change-bg.directive';
import { HomeComponent } from './components/pages/home/home.component';
import { CaseStudyDetailComponent } from './components/pages/case-study-detail/case-study-detail.component';
import { PupilReflexesTestComponent } from './components/pages/eye-tests/pupil-reflexes-test/pupil-reflexes-test.component';
import { VisualFieldsTestLeftComponent } from './components/pages/eye-tests/visual-fields-test-left/visual-fields-test-left.component';
import { VisualAcuityTestComponent } from './components/pages/eye-tests/visual-acuity-test/visual-acuity-test.component';
import { EyeMovementsTestComponent } from './components/pages/eye-tests/eye-movements-test/eye-movements-test.component';
import { DirectOphthalmoscopyTestComponent } from './components/pages/eye-tests/direct-opthamaloscopy/direct-ophthalmoscopy-test/direct-ophthalmoscopy-test.component';
import { NavbarComponent } from './components/partials/navbars/navbar-case-study/navbar.component';
import { LoadingComponent } from './components/partials/loading/loading.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { TitleComponent } from './components/partials/text/title/title.component';


// Import the module from the SDK
import { AuthButtonComponent } from './components/partials/buttons folder/buttons/auth-button.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { InputContainerComponent } from './components/partials/text/input-container/input-container.component'; 
import { DefaultButtonComponent } from './components/partials/buttons folder/default-button/default-button.component';
import { InputValidationComponent } from './components/partials/text/input-validation/input-validation.component'; 
import { TextInputComponent } from './components/partials/text/text-input/text-input.component'; 
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { VisualFieldsTestRightComponent } from './components/pages/eye-tests/visual-fields-test-right/visual-fields-test-right.component';
import { AdminAvgScoreVsTimeComponent } from './components/pages/graphs/userscores/admin-avg-score-vs-time/admin-avg-score-vs-time.component'; 
import { AdminRegistrationsOverTimeComponent } from './components/pages/graphs/admin/admin-registrations-over-time/admin-registrations-over-time.component'; 
import { AdminNavbarComponent } from './components/partials/navbars/admin-navbar/admin-navbar.component';
import { PatientConvoComponent } from './components/partials/text/patient-convo/patient-convo.component';
import { TestVisualFieldsTestComponent } from './components/pages/eye-tests/test-visual-fields-test/test-visual-fields-test.component';
import { NavbarUserscoreComponent } from './components/partials/navbars/navbar-userscore/navbar-userscore.component';
import { UserscoreScoreOverTimeComponent } from './components/pages/graphs/userscores/userscore-score-over-time/userscore-score-over-time.component';
import { UserProfilePageComponent } from './components/pages/user-profile-page/user-profile-page.component';
import { AvatarComponent } from './components/partials/avatar/avatar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { QaComponent } from './components/partials/text/qa/qa.component';
import { EyeTestQuestionsComponent } from './components/pages/QA/abstract-test/eye-test-questions/eye-test-questions.component';
import { DiagnosisQuestionsComponent } from './components/pages/QA/abstract-test/diagnosis-questions/diagnosis-questions.component';
import { InvestigationsQuestionsComponent } from './components/pages/QA/abstract-test/investigations-questions/investigations-questions.component';
import { DirectOphthalmoscopyTestRightComponent } from './components/pages/eye-tests/direct-opthamaloscopy/direct-ophthalmoscopy-test-right/direct-ophthalmoscopy-test-right.component';
import { UserScoresComponent } from './components/pages/graphs/userscores/user-scores/user-scores.component';
import { UserScoresOverTimeGraphComponent } from './components/pages/graphs/user/user-scores-over-time-graph/user-scores-over-time-graph.component';
import { UserCaseStudyCorrectVsOncorrectComponent } from './components/pages/graphs/user/user-case-study-correct-vs-oncorrect/user-case-study-correct-vs-oncorrect.component';
import { UserCaseStudyQuestionTypeCorrectVsIncorrectComponent } from './components/pages/graphs/user/user-case-study-question-type-correct-vs-incorrect/user-case-study-question-type-correct-vs-incorrect.component';
import { AdminCaseStudyCorrectVsIncorrectComponent } from './components/pages/graphs/admin/admin-case-study-correct-vs-incorrect/admin-case-study-correct-vs-incorrect.component';
import { AdminAvgScoreOverTimeComponent } from './components/pages/graphs/admin/admin-global-avg-score-over-time/admin-avg-score-over-time.component';
import { AdminCaseStudyAvgScoreOverTimeComponent } from './components/pages/graphs/admin/admin-case-study-avg-score-over-time/admin-case-study-avg-score-over-time.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    ChangeBgDirective,
    HomeComponent,
    CaseStudyDetailComponent,
    PupilReflexesTestComponent,
    VisualFieldsTestLeftComponent,
    VisualFieldsTestRightComponent,
    VisualAcuityTestComponent,
    EyeMovementsTestComponent,
    DirectOphthalmoscopyTestComponent,
    NavbarComponent,
    AuthButtonComponent,
    LoadingComponent,
    TitleComponent,
    LoginPageComponent,
    TextInputComponent,
    InputContainerComponent,
    DefaultButtonComponent,
    InputValidationComponent,
    LoadingComponent,
    RegisterPageComponent,
    FooterComponent,
    AdminAvgScoreVsTimeComponent,
    AdminRegistrationsOverTimeComponent,
    AdminNavbarComponent,
    PatientConvoComponent,
    VisualAcuityTestComponent,
    TestVisualFieldsTestComponent,
    NavbarUserscoreComponent,
    UserscoreScoreOverTimeComponent,
    UserProfilePageComponent,
    AvatarComponent,
    QaComponent,
    EyeTestQuestionsComponent,
    DiagnosisQuestionsComponent,
    InvestigationsQuestionsComponent,
    DirectOphthalmoscopyTestRightComponent,
    UserScoresComponent,
    UserScoresOverTimeGraphComponent,
    UserCaseStudyCorrectVsOncorrectComponent,
    UserCaseStudyQuestionTypeCorrectVsIncorrectComponent,
    AdminCaseStudyCorrectVsIncorrectComponent,
    AdminAvgScoreOverTimeComponent,
    AdminCaseStudyAvgScoreOverTimeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    //module used for root
    ToastrModule.forRoot({
      timeOut:3000, // stays for 3 seconds message
      positionClass:'toast-bottom-right', //shows in bottom right
      newestOnTop:false // new messages stay and old messages are removed
    }),
    ReactiveFormsModule, // import for login forms
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  //need to set providers which adds interceptor 
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi: true },
    {provide:HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }