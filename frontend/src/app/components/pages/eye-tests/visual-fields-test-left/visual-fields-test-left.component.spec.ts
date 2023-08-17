import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualFieldsTestLeftComponent } from './visual-fields-test-left.component';

describe('VisualFieldsTestLeftComponent', () => {
  let component: VisualFieldsTestLeftComponent;
  let fixture: ComponentFixture<VisualFieldsTestLeftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualFieldsTestLeftComponent]
    });
    fixture = TestBed.createComponent(VisualFieldsTestLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
