import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  case_studies: CaseStudies[] = [];
  isLoggedIn: boolean = false;


  constructor(private useCaseService: UseCaseService, private userService: UserService) {
    this.userService.userObservable.subscribe((user) => {
      this.isLoggedIn = !!user.token; // Check if user is logged in
      if (this.isLoggedIn) {
        this.loadCaseStudies();
      }
    });
  }

  ngOnInit(): void {
  }

  // Load case studies
  loadCaseStudies() {
    let useCaseObservalbe: Observable<CaseStudies[]>;

    useCaseObservalbe = this.useCaseService.getAll();

    useCaseObservalbe.subscribe((serverCaseStudies) => {
      this.case_studies = serverCaseStudies;
    });
  }

  //populate case study description returns a number
getDescription(caseStudyNumber: number): string {

  //case study 1
  if (caseStudyNumber === 1) {
    return `Sudden loss of vision.`;
  } else if (caseStudyNumber === 2) {
    //case study 2
    return `Headaches and visual symptoms.`;
    //case study 3
  } else {
    return `Blur in only eye.`;
  }
}

}
