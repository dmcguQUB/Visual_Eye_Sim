import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  //this is a method to return an array of case studies
  case_studies: CaseStudies[] = [];

  constructor(private useCaseService: UseCaseService) {
    let useCaseObservalbe: Observable<CaseStudies[]>;

    useCaseObservalbe = useCaseService.getAll();

    useCaseObservalbe.subscribe((serverCaseStudies) => {
      this.case_studies = serverCaseStudies;
    });
  }

  ngOnInit(): void {}
}
