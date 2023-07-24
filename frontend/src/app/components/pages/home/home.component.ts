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
}
