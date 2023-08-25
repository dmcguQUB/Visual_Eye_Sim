import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCaseStudyQuestionTypeCorrectVsIncorrectComponent } from './user-case-study-question-type-correct-vs-incorrect.component';

describe('UserCaseStudyQuestionTypeCorrectVsIncorrectComponent', () => {
  let component: UserCaseStudyQuestionTypeCorrectVsIncorrectComponent;
  let fixture: ComponentFixture<UserCaseStudyQuestionTypeCorrectVsIncorrectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCaseStudyQuestionTypeCorrectVsIncorrectComponent]
    });
    fixture = TestBed.createComponent(UserCaseStudyQuestionTypeCorrectVsIncorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
