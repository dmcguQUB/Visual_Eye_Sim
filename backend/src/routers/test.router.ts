//backend/src/routers/userscores.router.ts
// Import necessary modules and dependencies
import { Router } from "express"; 
import expressAsyncHandler from "express-async-handler";
import { sample_test_data } from "../data";
import authMid from "../middlewares/auth.mid";
import { TestModel } from "../models/test";
import { RequestWithUser } from "../models/user.model";
import { UserScoreModel } from "../models/userscores"; // Importing the UserScoreModel

// Create a new router instance using Express's Router
const router = Router();

//WORKS
// API endpoint to populate the user scores collection with sample data
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const testCount = await TestModel.countDocuments();
    
    if (testCount > 0) {
      res.send("Test seed is already done");
      return;
    }
    
    await TestModel.create(sample_test_data);
    res.send("Test seed is done now");
  })
);

//WORKS
// API endpoint to fetch all user scores from the collection
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const test = await TestModel.find();
    res.send(test);
  })
);

//WORKS
// API endpoint to fetch scores for a specific user
router.get(
  "/user/:userId",
  expressAsyncHandler(async (req, res) => {
    const test = await TestModel.find({ userId: req.params.userId });
    if (test) {
      res.send(test);
    } else {
      res.status(404).send({ message: 'Scores not found' });
    }
  })
);

//WORKS
//posting a test score for speific case study and test
//If a user is posting an eye-test, a new document will be created.
//If a user is posting investigations or diagnosis tests, the most recent document (associated with the given caseStudyId for that user) will be updated.
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
      const testData = requestWithUser.body;

      // Validate user existence and ID
      if (!requestWithUser.user || !requestWithUser.user._id) {
        throw new Error('User information is missing.');
      }
      testData.userId = requestWithUser.user._id;

      // Determine the action based on the test type
      if (testData.eyeTest) {
        // If eye test data is present, always create a new entry
        const newTest = new TestModel(testData);
        const savedTest = await newTest.save();
        res.status(201).send(savedTest);
      } else {
        // For investigations or diagnosis, update the most recent document
        const recentTest = await TestModel.findOne({
          userId: testData.userId,
          caseStudyId: testData.caseStudyId
        }).sort('-createdAt');

        if (!recentTest) {
          throw new Error('No recent eye test found to update.');
        }

        if (testData.investigationsTest) {
          recentTest.investigationsTest = testData.investigationsTest;
        }
        
        if (testData.diagnosisTest) {
          recentTest.diagnosisTest = testData.diagnosisTest;
        }

        const updatedTest = await recentTest.save();
        res.status(200).send(updatedTest);
      }
    } catch (error) {
      console.log(error);  // Log error message
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      }
    }
  })
);

//WORKS
// 1. Aggregate scores and answers for each specific test within a specific case study
router.get(
  "/test-scores/case-study/:caseStudyId",
  expressAsyncHandler(async (req, res) => {
    const caseStudyId = req.params.caseStudyId;

    // Aggregate for eyeTest
    const aggregationEyeTest = await TestModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: '$eyeTest.answers' },
      // Group by the correctness of each answer and count them
      {
        $group: {
          _id: '$eyeTest.answers.correct',
          count: { $sum: 1 }
        },
      },
      // Aggregate further to count correct answers and total attempted
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] }
          },
          totalAttempted: {
            $sum: "$count"
          }
        }
      }
    ]);

    // Aggregate for investigationsTest
    const aggregationInvestigationsTest = await TestModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: '$investigationsTest.answers' },
      {
        $group: {
          _id: '$investigationsTest.answers.correctAnswers',
          count: { $sum: 1 }
        },
      },
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] }
          },
          totalAttempted: {
            $sum: "$count"
          }
        }
      }
    ]);

    // Aggregate for diagnosisTest
    const aggregationDiagnosisTest = await TestModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: '$diagnosisTest.answers' },
      {
        $group: {
          _id: '$diagnosisTest.answers.correct',
          count: { $sum: 1 }
        },
      },
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] }
          },
          totalAttempted: {
            $sum: "$count"
          }
        }
      }
    ]);

    res.status(200).json({
      eyeTest: aggregationEyeTest,
      investigationsTest: aggregationInvestigationsTest,
      diagnosisTest: aggregationDiagnosisTest
    });
  })
);


// 2. Global scores and answers across all tests and case studies
router.get(
  "test-scores/global-scores",
  expressAsyncHandler(async (req, res) => {
    // Aggregate global scores and answers for eyeTest
    const globalAggregationEyeTest = await TestModel.aggregate([

      //cpimys 
      { $unwind: '$eyeTest.answers' },
      {
        $group: {
          _id: '$eyeTest.answers.correct',
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregate global scores and answers for investigationsTest
    const globalAggregationInvestigationsTest = await TestModel.aggregate([
      { $unwind: '$investigationsTest.answers' },
      {
        $group: {
          _id: '$investigationsTest.answers.correctAnswers',
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregate global scores and answers for diagnosisTest
    const globalAggregationDiagnosisTest = await TestModel.aggregate([
      { $unwind: '$diagnosisTest.answers' },
      {
        $group: {
          _id: '$diagnosisTest.answers.correct',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      eyeTest: globalAggregationEyeTest,
      investigationsTest: globalAggregationInvestigationsTest,
      diagnosisTest: globalAggregationDiagnosisTest
    });
  })
);



// Export the router so it can be used in other files (e.g., server.ts)
export default router;
