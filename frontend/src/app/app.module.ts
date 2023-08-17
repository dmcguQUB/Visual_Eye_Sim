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
import { QuestionComponent } from './components/pages/QA/question/question.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { ChangeBgDirective } from './shared/directives/change-bg.directive';
import { HomeComponent } from './components/pages/home/home.component';
import { CaseStudyDetailComponent } from './components/pages/case-study-detail/case-study-detail.component';
import { PupilReflexesTestComponent } from './components/pages/eye-tests/pupil-reflexes-test/pupil-reflexes-test.component';
import { VisualFieldsTestLeftComponent } from './components/pages/eye-tests/visual-fields-test-left/visual-fields-test-left.component';
import { VisualAcuityTestComponent } from './components/pages/eye-tests/visual-acuity-test/visual-acuity-test.component';
import { EyeMovementsTestComponent } from './components/pages/eye-tests/eye-movements-test/eye-movements-test.component';
import { DirectOphthalmoscopyTestComponent } from './components/pages/eye-tests/direct-ophthalmoscopy-test/direct-ophthalmoscopy-test.component';
import { NavbarComponent } from './components/partials/navbar-case-study/navbar.component';
import { LoadingComponent } from './components/partials/loading/loading.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { TitleComponent } from './components/partials/title/title.component';


// Import the module from the SDK
import { AuthButtonComponent } from './components/partials/buttons/auth-button.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { InputContainerComponent } from './components/partials/input-container/input-container.component'; 
import { DefaultButtonComponent } from './components/partials/default-button/default-button.component';
import { InputValidationComponent } from './components/partials/input-validation/input-validation.component'; 
import { TextInputComponent } from './components/partials/text-input/text-input.component'; 
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { ScoresComponent } from './components/pages/graphs/scores/scores.component';
import { AdminPageComponent } from './components/pages/graphs/admin-page/admin-page.component';
import { VisualFieldsTestRightComponent } from './components/pages/eye-tests/visual-fields-test-right/visual-fields-test-right.component';
import { AdminAvgScoreVsTimeComponent } from './components/pages/graphs/admin-avg-score-vs-time/admin-avg-score-vs-time.component';
import { AdminRegistrationsOverTimeComponent } from './components/pages/graphs/admin-registrations-over-time/admin-registrations-over-time.component';
import { AdminNavbarComponent } from './components/partials/admin-navbar/admin-navbar.component';
import { PatientConvoComponent } from './components/partials/patient-convo/patient-convo.component';
import { TestVisualFieldsTestComponent } from './components/pages/eye-tests/test-visual-fields-test/test-visual-fields-test.component';
import { NavbarUserscoreComponent } from './components/partials/navbar-userscore/navbar-userscore.component';
import { UserscoreScoreOverTimeComponent } from './components/pages/graphs/userscore-score-over-time/userscore-score-over-time.component';
import { UserProfilePageComponent } from './components/pages/user-profile-page/user-profile-page.component';
import { AvatarComponent } from './components/partials/avatar/avatar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { InvestigationsSelectionComponent } from './components/pages/QA/investigations-selection/investigations-selection.component';
import { PatientConversationComponent } from './components/partials/patient-conversation/patient-conversation.component';
import { QaComponent } from './components/partials/qa/qa.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    QuestionComponent,
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
    ScoresComponent,
    AdminPageComponent,
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
    InvestigationsSelectionComponent,
    PatientConversationComponent,
    QaComponent,
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