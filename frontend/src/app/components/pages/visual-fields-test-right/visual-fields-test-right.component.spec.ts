import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualFieldsTestRightComponent } from './visual-fields-test-right.component';


describe('VisualFieldsTestRightComponent', () => {
  let component: VisualFieldsTestRightComponent;
  let fixture: ComponentFixture<VisualFieldsTestRightComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualFieldsTestRightComponent]
    });
    fixture = TestBed.createComponent(VisualFieldsTestRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
