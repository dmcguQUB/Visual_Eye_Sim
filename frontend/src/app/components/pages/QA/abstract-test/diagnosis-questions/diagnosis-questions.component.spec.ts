import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisQuestionsComponent } from './diagnosis-questions.component';

describe('DiagnosisQuestionsComponent', () => {
  let component: DiagnosisQuestionsComponent;
  let fixture: ComponentFixture<DiagnosisQuestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagnosisQuestionsComponent]
    });
    fixture = TestBed.createComponent(DiagnosisQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
