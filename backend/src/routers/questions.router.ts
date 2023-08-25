//backend/src/routers/questions.router.ts
// Import necessary modules and dependencies
import { Router } from "express"; // Importing the Router class from Express
import expressAsyncHandler from "express-async-handler"; // Middleware for handling asynchronous operations safely
import { sample_questions } from "../data"; // Sample quiz questions data (used for seeding)
import { Option } from "../interface/option";
import { QuizModel } from "../models/questions"; // Importing the QuizModel

// Create a new router instance using Express's Router
const router = Router();

//1) API endpoint to populate the quiz model with sample questions
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // Count the number of existing quiz questions in the database
    const quizCount = await QuizModel.countDocuments();
    
    // If quiz questions are already seeded, send a response and exit
    if (quizCount > 0) {
      res.send("Quiz seed is already done");
      return;
    }
    
    // If not already seeded, create quiz questions using the sample data
    await QuizModel.create(sample_questions);
    res.send("Quiz seed is done now");
  })
);

// 2) API endpoint to get all quiz questions
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // Retrieve all quiz questions from the database using QuizModel
    const questions = await QuizModel.find();
    res.send(questions); // Return all the quiz questions fetched from the database
  })
);

//3) API endpoint to get questions for a specific case study by its ID
router.get(
  "/case_study/:id",
  expressAsyncHandler(async (req, res) => {
    // Retrieve quiz questions for a specific case study using QuizModel and caseStudyId
    const questions = await QuizModel.find({ caseStudyId: req.params.id });
    
    // If questions are found, send them as a response; otherwise, send a 404 response
    if (questions) {
      res.send(questions);
    } else {
      res.status(404).send({ message: 'Questions not found for case study' });
    }
  })
);


//4) API endpoint to get questions for a specific case study by its ID and type of question
router.get(
  "/case_study/:id/:type",
  expressAsyncHandler(async (req, res) => {
    const questions = await QuizModel.find({ 
      caseStudyId: req.params.id,
      questionType: req.params.type 
    });

    if (questions) {
      res.send(questions);
    } else {
      res.status(404).send({ message: 'Questions not found for case study' });
    }
  })
);


//5) API to get all correct answers for a question for a case study   (this returns an Array to allow for multiple choice)
router.get(
  "/correct_answers/case_study/:id/:questionType",
  expressAsyncHandler(async (req, res) => {
    // Retrieve quiz questions for a specific case study using QuizModel, caseStudyId, and questionType
    const questions = await QuizModel.find({ 
      caseStudyId: req.params.id, 
      questionType: req.params.questionType 
  });


    if (!questions) {
      res.status(404).send({ message: 'Questions not found for case study' });
      return;
    }

    // Create an array to store correct answers
    const correctAnswers: { questionId: string, questionText: string, correctOptions: Option[] }[] = [];

    // For each question, find all correct answers
    questions.forEach(question => {
      const correctOptions = question.options.filter(option => option.correct);
      if (correctOptions.length > 0) {
        correctAnswers.push({
          questionId: question._id.toString(),
          questionText: question.questionText,
          correctOptions: correctOptions
        });
      }
    });

    // Respond with the array of correct answers
    res.send(correctAnswers);
  })
);




// Export the router so it can be used in other files (e.g., server.ts)
export default router;
