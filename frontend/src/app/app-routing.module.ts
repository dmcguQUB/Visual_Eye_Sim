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

//autho required modules
import { AuthGuard } from '@auth0/auth0-angular';
import { ProfileModule } from './components/pages/auth0/profile/profile.module';
import { PublicModule } from './components/pages/auth0/public/public.module';
import { ProtectedModule } from './components/pages/auth0/protected/protected.module';
import { AdminModule } from './components/pages/auth0/admin/admin.module';
import { CallbackModule } from './components/pages/auth0/callback/callback.module';
import { NotFoundModule } from './components/pages/auth0/not-found/not-found.module';


const routes: Routes = [
  //home route
  {path: '',component:HomeComponent},
  {path: 'case-study/:useCaseId', component: CaseStudyPageComponent},
  { path: 'case-study-detail/:useCaseId', component: CaseStudyDetailComponent },
  { path: 'pupil-reflexes-test/:useCaseId', component: PupilReflexesTestComponent },
  { path: 'visual-fields-test/:useCaseId', component: VisualFieldsTestComponent }, // adding route to the routes array
  { path: 'visual-acuity-test/:useCaseId', component: VisualAcuityTestComponent }, 
  { path: 'eye-movements-test/:useCaseId', component: EyeMovementsTestComponent },
  { path: 'direct-ophthalmoscopy-test/:useCaseId', component: DirectOphthalmoscopyTestComponent },
  {path:"welcome", component:WelcomeComponent},
  {path:"question", component:QuestionComponent},
  //import callback module
  {
    path: 'auth0',
    pathMatch: 'full',
    loadChildren: () =>
      import('./components/pages/auth0/auth0-home/auth0-home.module').then((m) => m.Auth0HomeModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./components/pages/auth0/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'public',
    loadChildren: () =>
      import('./components/pages/auth0/public/public.module').then((m) => m.PublicModule),
  },
  {
    path: 'protected',
    loadChildren: () =>
      import('./components/pages/auth0/protected/protected.module').then(
        (m) => m.ProtectedModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/pages/auth0/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'callback',
    loadChildren: () =>
      import('./components/pages/auth0/callback/callback.module').then(
        (m) => m.CallbackModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./components/pages/auth0/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
