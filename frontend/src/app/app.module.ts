import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { QuestionComponent } from './components/pages/question/question.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChangeBgDirective } from './change-bg.directive';
import { HomeComponent } from './components/pages/home/home.component';
import { CaseStudyPageComponent } from './components/pages/case-study-page/case-study-page.component';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { CaseStudyDetailComponent } from './components/pages/case-study-detail/case-study-detail.component';
import { PupilReflexesTestComponent } from './components/pages/pupil-reflexes-test/pupil-reflexes-test.component';
import { VisualFieldsTestComponent } from './components/pages/visual-fields-test/visual-fields-test.component';
import { VisualAcuityTestComponent } from './components/pages/visual-acuity-test/visual-acuity-test.component';
import { EyeMovementsTestComponent } from './components/pages/eye-movements-test/eye-movements-test.component';
import { DirectOphthalmoscopyTestComponent } from './components/pages/direct-ophthalmoscopy-test/direct-ophthalmoscopy-test.component';
import { NavbarComponent } from './components/partials/navbar/navbar.component';
import { ToastrModule } from 'ngx-toastr';
import { LoadingComponent } from './components/partials/loading/loading.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { TitleComponent } from './components/partials/title/title.component';


// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';
import { AuthButtonComponent } from './components/partials/buttons/auth-button.component';
import { UserProfileComponent } from './components/partials/user-profile/user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { TextInputComponent } from './components/partials/text-input/text-input.component'; 
import { InputContainerComponent } from './components/partials/input-container/input-container.component'; 
import { DefaultButtonComponent } from './components/partials/default-button/default-button.component';
import { InputValidationComponent } from './components/partials/input-validation/input-validation.component'; 
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    QuestionComponent,
    HeaderComponent,
    ChangeBgDirective,
    HomeComponent,
    CaseStudyPageComponent,
    CaseStudyDetailComponent,
    PupilReflexesTestComponent,
    VisualFieldsTestComponent,
    VisualAcuityTestComponent,
    EyeMovementsTestComponent,
    DirectOphthalmoscopyTestComponent,
    NavbarComponent,
    AuthButtonComponent,
    UserProfileComponent,
    LoadingComponent,
    TitleComponent,
    LoginPageComponent,
    TextInputComponent,
    InputContainerComponent,
    DefaultButtonComponent,
    InputValidationComponent,
    InputContainerComponent,
    TextInputComponent,
    InputValidationComponent,
    LoadingComponent,
    DefaultButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule,
     // Import the module into the application, with configuration
     AuthModule.forRoot({
      domain: 'dev-7tjbr40gbhkjn2xi.us.auth0.com',
      clientId: 'LJovVWHFkNXSiWncavMZt9quL665PEoM',
      //allows Auth0 to redirect the user back to the specific URL after successfully authenticating.
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    FormsModule,
    //module used for root
    ToastrModule.forRoot({
      timeOut:3000, // stays for 3 seconds message
      positionClass:'toast-bottom-right', //shows in bottom right
      newestOnTop:false // new messages stay and old messages are removed
    }),
    ReactiveFormsModule, // import for login forms
    CommonModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi: true },
    {provide:HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }