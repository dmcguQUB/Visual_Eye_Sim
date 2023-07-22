import { Router } from "express"; 
import expressAsyncHandler from "express-async-handler";
import { sample_questions } from "../data";
import { QuizModel } from "../models/questions";

const router = Router();

router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const quizCount = await QuizModel.countDocuments();
    if (quizCount > 0) {
      res.send("Quiz seed is already done");
      return;
    }
    await QuizModel.create(sample_questions);
    res.send("Quiz seed is done now");
  })
);

router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const questions = await QuizModel.find();
    res.send(questions); 
  })
);

 //method to get questions for specific case study
 router.get(
  "/case_study/:id",
  expressAsyncHandler(async (req, res) => {
    const questions = await QuizModel.find({caseStudyId: req.params.id});
    if (questions) {
      res.send(questions);
    } else {
      res.status(404).send({ message: 'Questions not found for case study' });
    }
  })
);

//need to export router so can be used in server.ts file
export default router;
