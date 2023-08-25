//backend/src/routers/userscores.router.ts
// Import necessary modules and dependencies
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import {
  DIAGNOSIS_QUESTION_SCORE,
  EYE_TEST_QUESTION_SCORE,
  INVESTIGATION_OPTION_SCORE,
} from "../constants/points-per-question";
import { sample_test_data } from "../data";
import authMid from "../middlewares/auth.mid";
import { QuizModel } from "../models/questions";
import { TestModel } from "../models/test";
import { RequestWithUser } from "../models/user.model";

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
//1) API endpoint to fetch all user scores from the collection
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const test = await TestModel.find();
    res.send(test);
  })
);

//WORKS
//2) API endpoint to fetch scores for a specific user
router.get(
  "/user/:userId",
  expressAsyncHandler(async (req, res) => {
    const test = await TestModel.find({ userId: req.params.userId });
    if (test) {
      res.send(test);
    } else {
      res.status(404).send({ message: "Scores not found" });
    }
  })
);

//3) Get the user scores for the most recent test completed after being calculated for specific case study. Most recent submission selected
//WORKS
router.get(
  "/user/:userId/case_study/:caseStudyId",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const caseStudyId = req.params.caseStudyId;

    // Fetching the most recent test based on both userId and caseStudyId
    const test = await TestModel.findOne({
      userId: userId,
      caseStudyId: caseStudyId,
    }).sort({ createdAt: -1 }); // sorting by CREATED in descending order to get the most recent

    if (test) {
      res.send(test);
    } else {
      res
        .status(404)
        .send({ message: "Scores not found for the specified case study" });
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
      res.status(500).json({ error: "Internal server error" });
    }
  },
  expressAsyncHandler(async (req, res) => {
    const requestWithUser = req as RequestWithUser; // Type assertion for req

    try {
      const testData = requestWithUser.body;
      console.log("Received test data:", testData);

      // Validate user existence and ID
      if (!requestWithUser.user || !requestWithUser.user._id) {
        throw new Error("User information is missing.");
      }
      testData.userId = requestWithUser.user._id;

      // Determine the action based on the test type
      if (testData.eyeTest) {
        // If eye test data is present, always create a new entry
        const newTest = new TestModel(testData);
        const savedTest = await newTest.save();
        console.log("Sending saved testId:", savedTest._id);

        res.status(201).send({ test: savedTest, testId: savedTest._id });
      } else {
        // For investigations or diagnosis, update the most recent document
        const recentTest = await TestModel.findOne({
          userId: testData.userId,
          caseStudyId: testData.caseStudyId,
        }).sort({ createdAt: -1 });

        if (!recentTest) {
          throw new Error("No recent eye test found to update.");
        }

        if (testData.investigationsTest) {
          recentTest.investigationsTest = testData.investigationsTest;
        }

        if (testData.diagnosisTest) {
          recentTest.diagnosisTest = testData.diagnosisTest;
        }

        const updatedTest = await recentTest.save();
        console.log("Sending testId:", updatedTest._id);

        res.status(200).send({ test: updatedTest, testId: updatedTest._id });
      }
    } catch (error) {
      console.log(error); // Log error message
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      }
    }
  })
);

//4) calculate scores for a user on backend. Better security and prevents people from changing score on frontend
router.post(
  "/calculate_score/:testId",
  expressAsyncHandler(async (req: any, res: any) => {
    if (!req.params.testId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: "Invalid testId format" });
    }

    const testId = new mongoose.Types.ObjectId(req.params.testId);
    const userTest = await TestModel.findById(testId);

    if (!userTest) {
      return res.status(404).send({ message: "User test not found" });
    }

    let eyeTestScore = 0;
    let investigationsTestScore = 0;
    let diagnosisTestScore = 0;

    let correctEyeAnswers = 0;
    for (const answer of userTest.eyeTest.answers) {
      const question = await QuizModel.findById(answer.questionId);
      if (question) {
        const correctOption = question.options.find((opt) => opt.correct);
        if (correctOption && correctOption.text === answer.answer) {
          eyeTestScore += EYE_TEST_QUESTION_SCORE;
          correctEyeAnswers++;
        }
      }
    }
    userTest.eyeTest.totalQuestions = userTest.eyeTest.answers.length;
    userTest.eyeTest.correctAnswers = correctEyeAnswers;

    let correctInvestigationAnswers = 0;
    let totalCorrectOptions = 0;
    for (const answer of userTest.investigationsTest.answers) {
      const question = await QuizModel.findById(answer.questionId);
      if (question) {
        const correctAnswers = question.options
          .filter((opt) => opt.correct)
          .map((opt) => opt.text);
        totalCorrectOptions += correctAnswers.length;

        let isCorrect = true;
        for (const userAnswer of answer.userAnswers) {
          if (correctAnswers.includes(userAnswer)) {
            investigationsTestScore += INVESTIGATION_OPTION_SCORE;
          } else {
            investigationsTestScore -= INVESTIGATION_OPTION_SCORE;
            isCorrect = false;
          }
        }

        if (isCorrect) correctInvestigationAnswers++;
      }
    }

    userTest.investigationsTest.totalQuestions =
      userTest.investigationsTest.answers.length;
    userTest.investigationsTest.correctAnswers = correctInvestigationAnswers;
    if (userTest.investigationsTest.totalQuestions !== 0) {
      userTest.investigationsTest.percentage = Math.round(
        (investigationsTestScore /
          (INVESTIGATION_OPTION_SCORE * totalCorrectOptions)) *
          100
      );
    }

    let correctDiagnosisAnswers = 0;
    for (const answer of userTest.diagnosisTest.answers) {
      const question = await QuizModel.findById(answer.questionId);
      if (question) {
        const correctOption = question.options.find((opt) => opt.correct);
        if (correctOption && correctOption.text === answer.answer) {
          diagnosisTestScore += DIAGNOSIS_QUESTION_SCORE;
          correctDiagnosisAnswers++;
        }
      }
    }
    userTest.diagnosisTest.totalQuestions =
      userTest.diagnosisTest.answers.length;
    userTest.diagnosisTest.correctAnswers = correctDiagnosisAnswers;

    userTest.eyeTest.score = eyeTestScore;
    userTest.investigationsTest.score = investigationsTestScore;
    userTest.diagnosisTest.score = diagnosisTestScore;

    if (userTest.eyeTest.totalQuestions !== 0) {
      userTest.eyeTest.percentage = Math.round(
        (eyeTestScore /
          (userTest.eyeTest.totalQuestions * EYE_TEST_QUESTION_SCORE)) *
          100
      );
    }
    if (userTest.diagnosisTest.totalQuestions !== 0) {
      userTest.diagnosisTest.percentage = Math.round(
        (diagnosisTestScore /
          (userTest.diagnosisTest.totalQuestions * DIAGNOSIS_QUESTION_SCORE)) *
          100
      );
    }

    userTest.totalScore =
      userTest.eyeTest.score +
      userTest.investigationsTest.score +
      userTest.diagnosisTest.score;

    const eyeTestTotalPossibleScore =
      userTest.eyeTest.totalQuestions * EYE_TEST_QUESTION_SCORE;
    const investigationsTestTotalPossibleScore =
      totalCorrectOptions * INVESTIGATION_OPTION_SCORE;
    const diagnosisTestTotalPossibleScore =
      userTest.diagnosisTest.totalQuestions * DIAGNOSIS_QUESTION_SCORE;
    const totalPossibleScore =
      eyeTestTotalPossibleScore +
      investigationsTestTotalPossibleScore +
      diagnosisTestTotalPossibleScore;

    userTest.totalPercentage = Math.round(
      (userTest.totalScore / totalPossibleScore) * 100
    );

    await userTest.save();

    res.send({
      eyeTestScore: userTest.eyeTest.score,
      eyeTestPercentage: userTest.eyeTest.percentage || 0,
      investigationsTestScore: userTest.investigationsTest.score,
      investigationsTestPercentage: userTest.investigationsTest.percentage || 0,
      diagnosisTestScore: userTest.diagnosisTest.score,
      diagnosisTestPercentage: userTest.diagnosisTest.percentage || 0,
      totalScore: userTest.totalScore,
      totalPercentage: userTest.totalPercentage,
    });
  })
);

//ADMIN
//WORKS
//5) Aggregate scores and answers for each specific test within a specific case study
router.get(
  "/test-scores/case-study/:caseStudyId",
  expressAsyncHandler(async (req, res) => {
    const caseStudyId = req.params.caseStudyId;

    // Get the average percentages for each test within the specific case study
    const averagePercentages = await TestModel.aggregate([
      { $match: { caseStudyId } },
      {
        $group: {
          _id: null,
          eyeTestAveragePercentage: { $avg: "$eyeTest.percentage" },
          investigationsTestAveragePercentage: { $avg: "$investigationsTest.percentage" },
          diagnosisTestAveragePercentage: { $avg: "$diagnosisTest.percentage" },
        },
      },
    ]);
    
    const totalAveragePercentage =
      (averagePercentages[0]?.eyeTestAveragePercentage +
        averagePercentages[0]?.investigationsTestAveragePercentage +
        averagePercentages[0]?.diagnosisTestAveragePercentage) /
      3; // divide by 3 since there are three tests
    
    res.status(200).json({
      eyeTest: {
        averagePercentage: Math.round(averagePercentages[0]?.eyeTestAveragePercentage || 0),
      },
      investigationsTest: {
        averagePercentage: Math.round(averagePercentages[0]?.investigationsTestAveragePercentage || 0),
      },
      diagnosisTest: {
        averagePercentage: Math.round(averagePercentages[0]?.diagnosisTestAveragePercentage || 0),
      },
      allTestsForCaseStudy: {
        averagePercentage: Math.round(totalAveragePercentage),
      },
    });
    
  })
);

//ADMIN
//WORKS
//6) Global scores and answers across all tests and case studies
router.get("/test-scores/global-scores", expressAsyncHandler(async (req, res) => {
    
  // Aggregate the percentages for all tests
  const globalAggregation = await TestModel.aggregate([
      {
          $group: {
              _id: null,
              totalEyeTestPercentage: { $sum: "$eyeTest.percentage" },
              totalInvestigationsTestPercentage: { $sum: "$investigationsTest.percentage" },
              totalDiagnosisTestPercentage: { $sum: "$diagnosisTest.percentage" },
              count: { $sum: 1 } // Counting the number of documents (tests) to get an average later
          }
      }
  ]);

  const countOfTests = globalAggregation[0]?.count;

  // Calculating the global average percentage for each test and rounding it
  const averageEyeTestPercentage = Math.round(globalAggregation[0]?.totalEyeTestPercentage / countOfTests);
  const averageInvestigationsTestPercentage = Math.round(globalAggregation[0]?.totalInvestigationsTestPercentage / countOfTests);
  const averageDiagnosisTestPercentage = Math.round(globalAggregation[0]?.totalDiagnosisTestPercentage / countOfTests);

  // Calculating the overall global average percentage and rounding it
  const sumOfAveragePercentages = averageEyeTestPercentage + averageInvestigationsTestPercentage + averageDiagnosisTestPercentage;
  const globalAveragePercentage = Math.round(sumOfAveragePercentages / 3); // Since we have 3 tests

  res.status(200).json({
      eyeTest: {
          globalAveragePercentage: averageEyeTestPercentage
      },
      investigationsTest: {
          globalAveragePercentage: averageInvestigationsTestPercentage
      },
      diagnosisTest: {
          globalAveragePercentage: averageDiagnosisTestPercentage
      },
      overallGlobalAveragePercentage: globalAveragePercentage
  });
}));



//WORKS
//7) Average percentage score for each case study over time. Output shown on the following:
// //The total correct answers across all three tests for each test object.
// The total number of questions across all three tests for each test object.
// An average percentage calculated over time (e.g. for each day).
router.get(
  "/case-study/:caseStudyId/average-percentage-over-time",
  expressAsyncHandler(async (req: any, res: any) => {
    try {
      const caseStudyId = req.params.caseStudyId;

      const aggregationResults = await TestModel.aggregate([
        { $match: { caseStudyId } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            averageEyeTestPercentage: { $avg: "$eyeTest.percentage" },
            averageInvestigationsTestPercentage: { $avg: "$investigationsTest.percentage" },
            averageDiagnosisTestPercentage: { $avg: "$diagnosisTest.percentage" },
            overallAveragePercentage: { $avg: "$totalPercentage" }
          },
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            averageEyeTestPercentage: { $round: ["$averageEyeTestPercentage", 0] },
            averageInvestigationsTestPercentage: { $round: ["$averageInvestigationsTestPercentage", 0] },
            averageDiagnosisTestPercentage: { $round: ["$averageDiagnosisTestPercentage", 0] },
            overallAveragePercentage: { $round: ["$overallAveragePercentage", 0] }
          },
        },
        { $sort: { date: 1 } }, // Sorting by date
      ]);

      if (!aggregationResults.length) {
        return res
          .status(404)
          .send({ message: "Case study not found or no answers given yet." });
      }

      return res.send({ scoresOverTime: aggregationResults });
    } catch (error) {
      return res
        .status(500)
        .send({
          message:
            error instanceof Error
              ? `Server error: ${error.message}`
              : "An unexpected server error occurred.",
        });
    }
  })
);


//8 
// Average global scores across all case study over time
router.get(
  "/average-percentage-over-time",
  expressAsyncHandler(async (req: any, res: any) => {
    try {
      const aggregationResults = await TestModel.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            averageEyeTestPercentage: { $avg: "$eyeTest.percentage" },
            averageInvestigationsTestPercentage: { $avg: "$investigationsTest.percentage" },
            averageDiagnosisTestPercentage: { $avg: "$diagnosisTest.percentage" },
            overallAveragePercentage: { $avg: "$totalPercentage" }
          },
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            averageEyeTestPercentage: { $round: ["$averageEyeTestPercentage", 0] },
            averageInvestigationsTestPercentage: { $round: ["$averageInvestigationsTestPercentage", 0] },
            averageDiagnosisTestPercentage: { $round: ["$averageDiagnosisTestPercentage", 0] },
            overallAveragePercentage: { $round: ["$overallAveragePercentage", 0] }
          },
        },
        { $sort: { date: 1 } }, // Sorting by date
      ]);

      if (!aggregationResults.length) {
        return res
          .status(404)
          .send({ message: "No answers given yet." });
      }

      return res.send({ scoresOverTime: aggregationResults });
    } catch (error) {
      return res
        .status(500)
        .send({
          message:
            error instanceof Error
              ? `Server error: ${error.message}`
              : "An unexpected server error occurred.",
        });
    }
  })
);



// Export the router so it can be used in other files (e.g., server.ts)
export default router;
