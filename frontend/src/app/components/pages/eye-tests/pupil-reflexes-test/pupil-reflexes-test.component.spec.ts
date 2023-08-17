import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilReflexesTestComponent } from './pupil-reflexes-test.component';

describe('PupilReflexesTestComponent', () => {
  let component: PupilReflexesTestComponent;
  let fixture: ComponentFixture<PupilReflexesTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PupilReflexesTestComponent]
    });
    fixture = TestBed.createComponent(PupilReflexesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
