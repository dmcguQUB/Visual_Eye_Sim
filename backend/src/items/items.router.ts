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
itemsRouter.get("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

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