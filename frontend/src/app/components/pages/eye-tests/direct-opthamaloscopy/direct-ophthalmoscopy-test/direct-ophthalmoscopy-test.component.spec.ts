import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectOphthalmoscopyTestComponent } from './direct-ophthalmoscopy-test.component';

describe('DirectOphthalmoscopyTestComponent', () => {
  let component: DirectOphthalmoscopyTestComponent;
  let fixture: ComponentFixture<DirectOphthalmoscopyTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectOphthalmoscopyTestComponent]
    });
    fixture = TestBed.createComponent(DirectOphthalmoscopyTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
