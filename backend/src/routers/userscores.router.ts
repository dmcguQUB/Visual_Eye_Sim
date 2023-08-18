//backend/src/routers/userscores.router.ts
// Import necessary modules and dependencies
import { Router } from "express"; 
import expressAsyncHandler from "express-async-handler";
import { sample_user_scores } from "../data"; // Sample user scores data (used for seeding)
import { UserScoreModel } from "../models/userscores"; // Importing the UserScoreModel
import authMid from "../middlewares/auth.mid"; // Importing authentication middleware
import { RequestWithUser } from '../models/user.model'; // Importing RequestWithUser interface
import mongoose from 'mongoose'; // Importing mongoose (Make sure mongoose is imported)

// Create a new router instance using Express's Router
const router = Router();

// API endpoint to populate the user scores collection with sample data
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const userScoreCount = await UserScoreModel.countDocuments();
    
    // If user scores are already seeded, send a response and exit
    if (userScoreCount > 0) {
      res.send("User score seed is already done");
      return;
    }
    
    // Create user scores using sample data
    await UserScoreModel.create(sample_user_scores);
    res.send("User score seed is done now");
  })
);

// API endpoint to fetch all user scores from the collection
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const userScores = await UserScoreModel.find();
    res.send(userScores);
  })
);

// API endpoint to fetch scores for a specific user
router.get(
  "/user/:userId",
  expressAsyncHandler(async (req, res) => {
    const userScores = await UserScoreModel.find({ userId: req.params.userId });
    if (userScores) {
      res.send(userScores);
    } else {
      res.status(404).send({ message: 'Scores not found' });
    }
  })
);

// Middleware to authenticate user before submitting a new score
router.post(
  "/",
  (req, res, next) => {
    try {
      return authMid(req, res, next); // Authenticate using authMid middleware
    } catch (error) {
      console.error(error); // Log error
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  expressAsyncHandler(async (req, res) => {
    const requestWithUser = req as RequestWithUser; // Type assertion for req

    try {
      const scoreData = requestWithUser.body;

      // Validate user existence and ID
      if (requestWithUser.user && requestWithUser.user._id) {
        scoreData.userId = requestWithUser.user._id;
      } else {
        throw new Error('User information is missing.');
      }

      // Create and save the new score
      const newScore = new UserScoreModel(scoreData);
      const savedScore = await newScore.save();

      if (savedScore) {
        res.status(201).send(savedScore);
      } else {
        throw new Error('Error saving score');
      }
    } catch (error) {
      console.log(error);  // Log error message
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      }
    }
  })
);

// API endpoint to get total correct and incorrect answers for a case study
router.get(
  "/case-study/:caseStudyId",
  expressAsyncHandler(async (req, res) => {
    const caseStudyId = req.params.caseStudyId;
    
    // Aggregate correct and incorrect answers
    const aggregation = await UserScoreModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: '$answers' },
      {
        $group: {
          _id: '$answers.correct',
          count: { $sum: 1 },
        },
      },
    ]);
    
    // Extract correct and incorrect counts from the aggregation result
    const result = {
      correct: aggregation.find((a) => a._id === true)?.count || 0,
      incorrect: aggregation.find((a) => a._id === false)?.count || 0,
    };
    res.send(result);
  })
);

// API endpoint to get the average score for a case study
router.get(
  "/case-study/:caseStudyId/average-score",
  expressAsyncHandler(async (req, res) => {
    const caseStudyId = req.params.caseStudyId;

    // Aggregate total correct and total answers
    const aggregation = await UserScoreModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: '$answers' },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$answers.correct', 1, 0] } }
        },
      },
    ]);

    const result = aggregation[0];

    if (!result) {
      res.status(404).send({ message: 'Case study not found or no answers given yet.' });
      return;
    }

    const averageScore = (result.correct / result.total) * 100; // Calculate average score

    res.send({ averageScore }); // Send the average score as response
  })
);

// API endpoint to get average scores over time for a case study
router.get(
  "/case-study/:caseStudyId/average-score-over-time",
  expressAsyncHandler(async (req, res) => {
    const caseStudyId = req.params.caseStudyId;

    // Aggregate average scores over time
    const aggregation = await UserScoreModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: '$answers' },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$answers.correct', 1, 0] } },
          uniqueUsers: { $addToSet: "$userId" }
        },
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              'year': '$_id.year', 'month': '$_id.month', 'day': '$_id.day'
            }
          },
          averageScore: { $multiply: [ { $divide: ['$correct', '$total'] }, 100 ] },
          userCount: { $size: "$uniqueUsers" }
        }
      }
    ]);

    if (!aggregation.length) {
      res.status(404).send({ message: 'Case study not found or no answers given yet.' });
      return;
    }

    res.send(aggregation); // Send aggregated results as response
  })
);
//Works _ MIGHT NO LONGER NEED AS CAN GET MOST RECENT SCORE IN THE PATCH -  "/update-latest/:userId/:caseStudyId",
//get the lastest score for user and the corresponding CaseId. Mostly used to find the recent test to add the score to
router.get(
  "/latest/:userId/:caseStudyId",
  expressAsyncHandler(async (req, res) => {
    const { userId, caseStudyId } = req.params;

    const latestUserScore = await UserScoreModel.findOne({
      userId,
      caseStudyId
    }).sort({ createdAt: -1 });  // Sorting by creation date to get the latest score

    if (latestUserScore) {
      res.send(latestUserScore);
    } else {
      res.status(404).send({ message: 'Score not found for the given user and case study.' });
    }
  })
);

//WORKS
//API method to find the most recent score for a user and case study. The score will be updated with later tests scores (e.g. investigations and diagnosis scores)
router.patch(
  "/update-latest/:userId/:caseStudyId",
  expressAsyncHandler(async (req:any, res:any) => {
    const { userId, caseStudyId } = req.params;
    const newScore = req.body.score;  // Assuming the score from test 2 is passed in the request body

    if (typeof newScore !== 'number') {
      return res.status(400).send({ message: 'Invalid score value in request.' });
    }

    // First, fetch the latest score for the given user and case study
    const latestUserScore = await UserScoreModel.findOne({
      userId,
      caseStudyId
    }).sort({ createdAt: -1 });  // Sorting by creation date to get the latest score

    if (!latestUserScore) {
      return res.status(404).send({ message: 'Score not found for the given user and case study.' });
    }

    // Add the new score to the fetched score (score from test 1)
    latestUserScore.score += newScore;

    const updatedScore = await latestUserScore.save();  // Save the updated score

    if (updatedScore) {
      res.send(updatedScore);
    } else {
      res.status(500).send({ message: 'Failed to update the score.' });
    }
  })
);

// Export the router so it can be used in other files (e.g., server.ts)
export default router;
