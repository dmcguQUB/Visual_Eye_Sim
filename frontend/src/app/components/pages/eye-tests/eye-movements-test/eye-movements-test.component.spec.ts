import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeMovementsTestComponent } from './eye-movements-test.component';

describe('EyeMovementsTestComponent', () => {
  let component: EyeMovementsTestComponent;
  let fixture: ComponentFixture<EyeMovementsTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EyeMovementsTestComponent]
    });
    fixture = TestBed.createComponent(EyeMovementsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
