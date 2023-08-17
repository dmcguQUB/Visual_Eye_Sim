import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAvgScoreVsTimeComponent } from './admin-avg-score-vs-time.component';

describe('AdminAvgScoreVsTimeComponent', () => {
  let component: AdminAvgScoreVsTimeComponent;
  let fixture: ComponentFixture<AdminAvgScoreVsTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAvgScoreVsTimeComponent]
    });
    fixture = TestBed.createComponent(AdminAvgScoreVsTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
