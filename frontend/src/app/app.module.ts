import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { QuestionComponent } from './components/pages/question/question.component';
import { HeaderComponent } from './shared/components/header/header.component';
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
import { NavbarComponent } from './shared/components/navbar/navbar.component';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
