import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { sample_case_studies } from "../data";
import { CaseStudyModel } from "../models/case-study-model";

const router = Router();

//we are creating api to populate the case study model
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const caseStudyCount = await CaseStudyModel.countDocuments();
    if (caseStudyCount > 0) {
      res.send("Seed is already done");
      return;
    }
    await CaseStudyModel.create(sample_case_studies);
    res.send("Seed is done now");
  })
);

//getting all the sample use cases
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    //use Mongodb instead of data.ts file
    const case_studies = await CaseStudyModel.find();
    res.send(case_studies);
  })
);

//get the use case by ID
router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    console.log(CaseStudyModel.findById(req.params.id));
    const caseStudy = await CaseStudyModel.findById(req.params.id);
    res.send(caseStudy);
  })
);

export default router;
