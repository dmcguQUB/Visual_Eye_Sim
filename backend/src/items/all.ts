//backend/src/items/case-studies.interface.ts
import { CaseStudy } from "./case-study.interface";

export interface CaseStudies {
  [key: number]: CaseStudy;
}

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
export const find = async (id: number): Promise<CaseStudy> => caseStudies[id];

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

//backend/src/items/case-study-permission.ts
export enum caseStudyPermission {
  CreateItems = "create:items",
  UpdateItems = "update:items",
  DeleteItems = "delete:items",
}

//backend/src/items/case-study.interface.ts
export interface BaseCaseStudy {
  name: string,
  imageUrl: string,
  age: string,
  gender: string,
  medicalHistory: string,
  drugInfo: string,
  socialInfo: string,
  familyHistory: string
}

export interface CaseStudy extends BaseCaseStudy {
  id: number;
}


//backend/src/items/items.router.ts
/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as CaseStudiesServices from "./case-studies.service";
import { BaseCaseStudy, CaseStudy } from "./case-study.interface";

import { checkJwt } from "../middleware/authz.middleware";
import { checkPermissions } from "../middleware/permissions.middleware";
import { caseStudyPermission } from "./case-study-permission";
/**
 * Router Definition
 */
export const itemsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET items
itemsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const caseStudies: CaseStudy[] = await CaseStudiesServices.findAll();

    res.status(200).send(caseStudies);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
// GET items/:id
itemsRouter.get("/:useCaseId", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.useCaseId, 10);

  try {
    const item: CaseStudy = await CaseStudiesServices.find(id);

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send("item not found");
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
// Mount authorization middleware

itemsRouter.use(checkJwt);

// POST items

itemsRouter.post(
  "/",
  checkPermissions(caseStudyPermission.CreateItems),
  async (req: Request, res: Response) => {
    try {
      const item: BaseCaseStudy = req.body;

      const newItem = await CaseStudiesServices.create(item);

      res.status(201).json(newItem);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  }
);

// PUT items/:id

itemsRouter.put(
  "/:useCaseId",
  checkPermissions(caseStudyPermission.UpdateItems),
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.useCaseId, 10);

    try {
      const itemUpdate: CaseStudy = req.body;

      const existingItem: CaseStudy = await CaseStudiesServices.find(id);

      if (existingItem) {
        const updatedItem = await CaseStudiesServices.update(id, itemUpdate);
        return res.status(200).json(updatedItem);
      }

      const newItem = await CaseStudiesServices.create(itemUpdate);

      res.status(201).json(newItem);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  }
);

// DELETE items/:id

itemsRouter.delete(
  "/:id",
  checkPermissions(caseStudyPermission.DeleteItems),
  async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      await CaseStudiesServices.remove(id);

      res.sendStatus(204);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  }
);