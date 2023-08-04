import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUserscoreComponent } from './navbar-userscore.component';

describe('NavbarUserscoreComponent', () => {
  let component: NavbarUserscoreComponent;
  let fixture: ComponentFixture<NavbarUserscoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarUserscoreComponent]
    });
    fixture = TestBed.createComponent(NavbarUserscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
