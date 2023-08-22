import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectOphthalmoscopyTestRightComponent } from './direct-ophthalmoscopy-test-right.component';

describe('DirectOphthalmoscopyTestRightComponent', () => {
  let component: DirectOphthalmoscopyTestRightComponent;
  let fixture: ComponentFixture<DirectOphthalmoscopyTestRightComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectOphthalmoscopyTestRightComponent]
    });
    fixture = TestBed.createComponent(DirectOphthalmoscopyTestRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
