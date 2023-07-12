//backend/src/items/case-studies.interface.ts
import { CaseStudy } from "./case-study.interface";

export interface CaseStudies {
  [key: number]: CaseStudy;
}