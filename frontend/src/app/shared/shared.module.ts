import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginButtonComponent } from './components/buttons/login-button.component';
import { SignupButtonComponent } from './components/buttons/signup-button.component';
import { LogoutButtonComponent } from './components/buttons/logout-button.component';
import { Auth0FeatureComponent } from './components/auth0-feature.component';
import { Auth0FeaturesComponent } from './components/auth0-features.component';
import { CodeSnippetComponent } from './components/code-snippet.component';
import { HeroBannerComponent } from './components/hero-banner.component';
import { PageFooterHyperlinkComponent } from './components/page-footer-hyperlink.component';
import { PageFooterComponent } from './components/page-footer.component';
import { PageLayoutComponent } from './components/page-layout.component';
import { PageLoaderComponent } from './components/page-loader.component';
import { MobileNavBarBrandComponent } from './components/navigation/mobile/mobile-nav-bar-brand.component';
import { MobileNavBarButtonsComponent } from './components/navigation/mobile/mobile-nav-bar-buttons.component';
import { MobileNavBarTabComponent } from './components/navigation/mobile/mobile-nav-bar-tab.component';
import { MobileNavBarTabsComponent } from './components/navigation/mobile/mobile-nav-bar-tabs.component';
import { MobileNavBarComponent } from './components/navigation/mobile/mobile-nav-bar.component';
import { NavBarBrandComponent } from './components/navigation/desktop/nav-bar-brand.component';
import { NavBarButtonsComponent } from './components/navigation/desktop/nav-bar-buttons.component';
import { NavBarTabComponent } from './components/navigation/desktop/nav-bar-tab.component';
import { NavBarComponent } from './components/navigation/desktop/nav-bar.component';
import { NavBarTabsComponent } from './components/navigation/desktop/nav-bar-tabs.component';


@NgModule({
  declarations: [
    LoginButtonComponent,
    SignupButtonComponent,
    LogoutButtonComponent,
    Auth0FeatureComponent,
    Auth0FeaturesComponent,
    CodeSnippetComponent,
    HeroBannerComponent,
    PageFooterHyperlinkComponent,
    PageFooterComponent,
    PageLayoutComponent,
    PageLoaderComponent,
    MobileNavBarBrandComponent,
    MobileNavBarButtonsComponent,
    MobileNavBarTabComponent,
    MobileNavBarTabsComponent,
    MobileNavBarComponent,
    NavBarBrandComponent,
    NavBarButtonsComponent,
    NavBarTabComponent,
    NavBarTabsComponent,
    NavBarComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    LoginButtonComponent,
    SignupButtonComponent,
    LogoutButtonComponent,
    Auth0FeatureComponent,
    Auth0FeaturesComponent,
    CodeSnippetComponent,
    HeroBannerComponent,
    PageFooterHyperlinkComponent,
    PageFooterComponent,
    PageLayoutComponent,
    PageLoaderComponent,
    MobileNavBarBrandComponent,
    MobileNavBarButtonsComponent,
    MobileNavBarTabComponent,
    MobileNavBarTabsComponent,
    MobileNavBarComponent,
    NavBarBrandComponent,
    NavBarButtonsComponent,
    NavBarTabComponent,
    NavBarTabsComponent,
    NavBarComponent,
  ],
})
export class SharedModule {}
