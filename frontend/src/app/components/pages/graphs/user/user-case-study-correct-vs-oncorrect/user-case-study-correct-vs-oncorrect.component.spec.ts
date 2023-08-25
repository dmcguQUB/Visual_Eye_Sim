import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCaseStudyCorrectVsOncorrectComponent } from './user-case-study-correct-vs-oncorrect.component';

describe('UserCaseStudyCorrectVsOncorrectComponent', () => {
  let component: UserCaseStudyCorrectVsOncorrectComponent;
  let fixture: ComponentFixture<UserCaseStudyCorrectVsOncorrectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCaseStudyCorrectVsOncorrectComponent]
    });
    fixture = TestBed.createComponent(UserCaseStudyCorrectVsOncorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
