import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualAcuityTestComponent } from './visual-acuity-test.component';

describe('VisualAcuityTestComponent', () => {
  let component: VisualAcuityTestComponent;
  let fixture: ComponentFixture<VisualAcuityTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualAcuityTestComponent]
    });
    fixture = TestBed.createComponent(VisualAcuityTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
