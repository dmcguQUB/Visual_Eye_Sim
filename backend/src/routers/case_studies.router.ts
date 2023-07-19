import { Router } from "express"; //import router
import expressAsyncHandler from "express-async-handler";
import { sample_case_studies } from "../data";
import { CaseStudyModel } from "../models/case-study-model";

//create new router calling router method
const router = Router();

//we are creating api to populate the case study model
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const caseStudyCount = await CaseStudyModel.countDocuments();
    //if more than one already seeded
    if (caseStudyCount > 0) {
      res.send("Seed is already done");
      return;
    }
    //if not then it will seed
    await CaseStudyModel.create(sample_case_studies);
    res.send("Seed is done now");
  })
);

//getting all the sample use cases i
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    //use Mongodb instead of data.ts file
    const case_studies = await CaseStudyModel.find();
    res.send(case_studies); //return all the foods we got from the database
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

//need to export router so can be used in server.ts file
export default router;
