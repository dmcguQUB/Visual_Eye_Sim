import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationsReportComponent } from './investigations-report.component';

describe('InvestigationsReportComponent', () => {
  let component: InvestigationsReportComponent;
  let fixture: ComponentFixture<InvestigationsReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigationsReportComponent]
    });
    fixture = TestBed.createComponent(InvestigationsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
