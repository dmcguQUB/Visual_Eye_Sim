import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestVisualFieldsTestComponent } from './test-visual-fields-test.component';

describe('TestVisualFieldsTestComponent', () => {
  let component: TestVisualFieldsTestComponent;
  let fixture: ComponentFixture<TestVisualFieldsTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestVisualFieldsTestComponent]
    });
    fixture = TestBed.createComponent(TestVisualFieldsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
