import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationsSelectionComponent } from './investigations-selection.component';

describe('InvestigationsSelectionComponent', () => {
  let component: InvestigationsSelectionComponent;
  let fixture: ComponentFixture<InvestigationsSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigationsSelectionComponent]
    });
    fixture = TestBed.createComponent(InvestigationsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
