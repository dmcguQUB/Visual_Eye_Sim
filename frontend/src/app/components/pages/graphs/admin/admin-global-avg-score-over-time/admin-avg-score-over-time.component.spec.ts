import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAvgScoreOverTimeComponent } from './admin-avg-score-over-time.component';

describe('AdminAvgScoreOverTimeComponent', () => {
  let component: AdminAvgScoreOverTimeComponent;
  let fixture: ComponentFixture<AdminAvgScoreOverTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAvgScoreOverTimeComponent]
    });
    fixture = TestBed.createComponent(AdminAvgScoreOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
