import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserScoresOverTimeGraphComponent } from './user-scores-over-time-graph.component';

describe('UserScoresOverTimeGraphComponent', () => {
  let component: UserScoresOverTimeGraphComponent;
  let fixture: ComponentFixture<UserScoresOverTimeGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserScoresOverTimeGraphComponent]
    });
    fixture = TestBed.createComponent(UserScoresOverTimeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
