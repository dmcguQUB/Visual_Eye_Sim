import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeTestQuestionsComponent } from './eye-test-questions.component';

describe('EyeTestQuestionsComponent', () => {
  let component: EyeTestQuestionsComponent;
  let fixture: ComponentFixture<EyeTestQuestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EyeTestQuestionsComponent]
    });
    fixture = TestBed.createComponent(EyeTestQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
