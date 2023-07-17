//backend/src/items/case-studies.service.ts
/**
 * Data Model Interfaces
 */
import { BaseCaseStudy, CaseStudy } from "./case-study.interface";
import { CaseStudies } from "./case-studies.interface";

/**
 * In-Memory Store
 */
 let caseStudies: CaseStudies =
    [
      {
        id: 1,
        name: "Lizzy Bard",
        imageUrl: "assets/patient-1.jpg",
        age: "70",
        gender: "female",
        medicalHistory: "Hypertension",
        drugInfo: "Aspirin, Irbesartan, Artificial Tears, No drug allergies",
        socialInfo: "Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.",
        familyHistory: "Mother had cateracts. Father had lazy eye."
      },
      {
        id: 2,
        name: "Beth Tate",
        imageUrl: "assets/patient-2.jpg",
        age: "70",
        gender: "female",
        medicalHistory: "Hypertension",
        drugInfo: "Aspirin, Irbesartan, Artificial Tears, No drug allergies",
        socialInfo: "Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.",
        familyHistory: "Mother had cateracts. Father had lazy eye."
      },
      {
        id: 3,
        name: "Frank Howard",
        imageUrl: "assets/patient-3.jpg",
        age: "70",
        gender: "female",
        medicalHistory: "Hypertension",
        drugInfo: "Aspirin, Irbesartan, Artificial Tears, No drug allergies",
        socialInfo: "Stopped smoking 5 years ago. She has alcohol at Christmas only. Ex-office worker.",
        familyHistory: "Mother had cateracts. Father had lazy eye."
      }
    ]
    


/**
 * Service Methods
 */

//find all
export const findAll = async (): Promise<CaseStudy[]> => Object.values(caseStudies);

//find
export const find = async (id: number): Promise<CaseStudy> => {
  console.log(caseStudies); // Log the whole array to check if it's defined and what's in it

  return caseStudies.find(caseStudy => caseStudy.id === id);
};

//create
export const create = async (newItem: BaseCaseStudy): Promise<CaseStudy> => {
  const id = new Date().valueOf();

  caseStudies[id] = {
    id,
    ...newItem,
  };

  return caseStudies[id];
};

//update
export const update = async (
  id: number,
  itemUpdate: BaseCaseStudy
): Promise<CaseStudy | null> => {
  const item = await find(id);

  if (!item) {
    return null;
  }

  caseStudies[id] = { id, ...itemUpdate };

  return caseStudies[id];
};

//remove
export const remove = async (id: number): Promise<null | void> => {
  const item = await find(id);

  if (!item) {
    return null;
  }

  delete caseStudies[id];
};