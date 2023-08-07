import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualFieldsComponent } from './visual-fields.component';

describe('VisualFieldsComponent', () => {
  let component: VisualFieldsComponent;
  let fixture: ComponentFixture<VisualFieldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualFieldsComponent]
    });
    fixture = TestBed.createComponent(VisualFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
