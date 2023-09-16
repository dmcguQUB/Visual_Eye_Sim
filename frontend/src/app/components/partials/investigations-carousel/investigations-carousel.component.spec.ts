import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationsCarouselComponent } from './investigations-carousel.component';

describe('InvestigationsCarouselComponent', () => {
  let component: InvestigationsCarouselComponent;
  let fixture: ComponentFixture<InvestigationsCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigationsCarouselComponent]
    });
    fixture = TestBed.createComponent(InvestigationsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
