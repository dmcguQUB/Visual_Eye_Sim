//backend/src/routers/questions.router.ts
// Import necessary modules and dependencies
import { Router } from "express"; // Importing the Router class from Express
import expressAsyncHandler from "express-async-handler"; // Middleware for handling asynchronous operations safely
import { sample_questions } from "../data"; // Sample quiz questions data (used for seeding)
import { QuizModel } from "../models/questions"; // Importing the QuizModel

// Create a new router instance using Express's Router
const router = Router();

// API endpoint to populate the quiz model with sample questions
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

// API endpoint to get all quiz questions
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // Retrieve all quiz questions from the database using QuizModel
    const questions = await QuizModel.find();
    res.send(questions); // Return all the quiz questions fetched from the database
  })
);

// API endpoint to get questions for a specific case study by its ID
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

// Export the router so it can be used in other files (e.g., server.ts)
export default router;
