import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistrationsOverTimeComponent } from './admin-registrations-over-time.component';

describe('AdminRegistrationsOverTimeComponent', () => {
  let component: AdminRegistrationsOverTimeComponent;
  let fixture: ComponentFixture<AdminRegistrationsOverTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRegistrationsOverTimeComponent]
    });
    fixture = TestBed.createComponent(AdminRegistrationsOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
