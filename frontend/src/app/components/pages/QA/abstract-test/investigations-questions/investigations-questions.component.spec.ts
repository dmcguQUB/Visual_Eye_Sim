import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationsQuestionsComponent } from './investigations-questions.component';

describe('InvestigationsQuestionsComponent', () => {
  let component: InvestigationsQuestionsComponent;
  let fixture: ComponentFixture<InvestigationsQuestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigationsQuestionsComponent]
    });
    fixture = TestBed.createComponent(InvestigationsQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
