import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  case_studies: CaseStudies[] = [];
  isLoggedIn: boolean = false;
  private userSubscription!: Subscription;
  homepageImageUrl: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Queen%E2%80%99s_Red_Log.svg/1280px-Queen%E2%80%99s_Red_Log.svg.png';


  constructor(private useCaseService: UseCaseService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.userObservable.subscribe((user) => {
      this.isLoggedIn = !!user.token; // Check if user is logged in
      if (this.isLoggedIn) {
        this.loadCaseStudies();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Load case studies
  // Load case studies
  loadCaseStudies(): void {
    this.useCaseService.getAll().subscribe((serverCaseStudies) => {
      this.case_studies = serverCaseStudies;
    });
  }

  // Populate case study description returns a number
  getDescription(caseStudyNumber: number): string {
    switch (caseStudyNumber) {
      case 1: return `Sudden loss of vision.`;
      case 2: return `Headaches and visual symptoms.`;
      default: return `Blur in only eye.`;
    }
  }

}
