import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCaseStudyCorrectVsIncorrectComponent } from './admin-case-study-correct-vs-incorrect.component';

describe('AdminCaseStudyCorrectVsIncorrectComponent', () => {
  let component: AdminCaseStudyCorrectVsIncorrectComponent;
  let fixture: ComponentFixture<AdminCaseStudyCorrectVsIncorrectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCaseStudyCorrectVsIncorrectComponent]
    });
    fixture = TestBed.createComponent(AdminCaseStudyCorrectVsIncorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
