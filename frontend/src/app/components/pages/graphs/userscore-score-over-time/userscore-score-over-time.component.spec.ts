import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserscoreScoreOverTimeComponent } from './userscore-score-over-time.component';

describe('UserscoreScoreOverTimeComponent', () => {
  let component: UserscoreScoreOverTimeComponent;
  let fixture: ComponentFixture<UserscoreScoreOverTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserscoreScoreOverTimeComponent]
    });
    fixture = TestBed.createComponent(UserscoreScoreOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
