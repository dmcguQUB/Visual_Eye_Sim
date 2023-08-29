import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCaseStudyAvgScoreOverTimeComponent } from './admin-case-study-avg-score-over-time.component';

describe('AdminCaseStudyAvgScoreOverTimeComponent', () => {
  let component: AdminCaseStudyAvgScoreOverTimeComponent;
  let fixture: ComponentFixture<AdminCaseStudyAvgScoreOverTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCaseStudyAvgScoreOverTimeComponent]
    });
    fixture = TestBed.createComponent(AdminCaseStudyAvgScoreOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
