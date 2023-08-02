import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConvoComponent } from './patient-convo.component';

describe('PatientConvoComponent', () => {
  let component: PatientConvoComponent;
  let fixture: ComponentFixture<PatientConvoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientConvoComponent]
    });
    fixture = TestBed.createComponent(PatientConvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
