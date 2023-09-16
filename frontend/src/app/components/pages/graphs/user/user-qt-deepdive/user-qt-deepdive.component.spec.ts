import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQtDeepdiveComponent } from './user-qt-deepdive.component';

describe('UserQtDeepdiveComponent', () => {
  let component: UserQtDeepdiveComponent;
  let fixture: ComponentFixture<UserQtDeepdiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserQtDeepdiveComponent]
    });
    fixture = TestBed.createComponent(UserQtDeepdiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
