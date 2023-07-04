import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualFieldsTestComponent } from './visual-fields-test.component';

describe('VisualFieldsTestComponent', () => {
  let component: VisualFieldsTestComponent;
  let fixture: ComponentFixture<VisualFieldsTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualFieldsTestComponent]
    });
    fixture = TestBed.createComponent(VisualFieldsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
