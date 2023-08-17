import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConversationComponent } from './patient-conversation.component';

describe('PatientConversationComponent', () => {
  let component: PatientConversationComponent;
  let fixture: ComponentFixture<PatientConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientConversationComponent]
    });
    fixture = TestBed.createComponent(PatientConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
