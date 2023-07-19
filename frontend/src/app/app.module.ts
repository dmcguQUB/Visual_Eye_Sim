import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { QuestionComponent } from './components/pages/question/question.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HttpClientModule } from '@angular/common/http';
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

// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';
import { AuthButtonComponent } from './components/partials/buttons/auth-button.component';
import { UserProfileComponent } from './components/partials/user-profile/user-profile.component';
import { FormsModule } from '@angular/forms';

import { environment as env } from '../environments/environment';
import { SharedModule } from './shared';//




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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule,
    //  // Import the module into the application, with configuration
    //  AuthModule.forRoot({
    //   domain: 'dev-7tjbr40gbhkjn2xi.us.auth0.com',
    //   clientId: 'LJovVWHFkNXSiWncavMZt9quL665PEoM',
    //   //allows Auth0 to redirect the user back to the specific URL after successfully authenticating.
    //   authorizationParams: {
    //     redirect_uri: window.location.origin
    //   }
    // }),
    AuthModule.forRoot({
      ...env.auth0,
    }),
    FormsModule,
    SharedModule, // for auth0 rendering
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
