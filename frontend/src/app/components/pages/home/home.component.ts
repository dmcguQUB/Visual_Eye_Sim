import { Component, OnInit } from '@angular/core';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  case_studies: CaseStudies[] = [];

  constructor(private useCaseService : UseCaseService) {
    this.case_studies = this.useCaseService.getAll();
  }

  ngOnInit(): void {}
}
