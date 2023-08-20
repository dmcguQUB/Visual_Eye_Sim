//backend/src/routers/userscores.router.ts
// Import necessary modules and dependencies
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DIAGNOSIS_QUESTION_SCORE, EYE_TEST_QUESTION_SCORE, INVESTIGATION_QUESTION_SCORE } from "../constants/scores";
import { sample_test_data } from "../data";
import authMid from "../middlewares/auth.mid";
import { QuizModel } from "../models/questions";
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
      res.status(404).send({ message: "Scores not found" });
    }
  })
);


//Get the user scores for the most recent test completed after being calculated for specific case study. Most recent submission selected
//WORKS
router.get(
  "/user/:userId/case_study/:caseStudyId",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const caseStudyId = req.params.caseStudyId;

    // Fetching the most recent test based on both userId and caseStudyId
    const test = await TestModel.findOne({ 
      userId: userId, 
      caseStudyId: caseStudyId 
    }).sort({ dateTaken: -1 });  // sorting by dateTaken in descending order to get the most recent

    if (test) {
      res.send(test);
    } else {
      res.status(404).send({ message: "Scores not found for the specified case study" });
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
        res.status(201).send(savedTest);
      } else {
        // For investigations or diagnosis, update the most recent document
        const recentTest = await TestModel.findOne({
          userId: testData.userId,
          caseStudyId: testData.caseStudyId,
        }).sort("-createdAt");

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
        res.status(200).send(updatedTest);
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
  "/calculate_score/:userId",
  expressAsyncHandler(async (req:any, res:any) => {
    const userTest = await TestModel.findOne({ userId: req.params.userId });
    if (!userTest) {
      return res.status(404).send({ message: 'User test not found' });
    }

    let eyeTestScore = 0;
    let investigationsTestScore = 0;
    let diagnosisTestScore = 0;

    // For eyeTest
    for (const answer of userTest.eyeTest.answers) {
      const question = await QuizModel.findById(answer.questionId);
      if (question) {
        const correctOption = question.options.find(opt => opt.correct);
        if (correctOption && correctOption.text === answer.answer) {
          eyeTestScore += EYE_TEST_QUESTION_SCORE;
        }
      }
    }

// For investigationsTest (multiple-choice)
for (const answer of userTest.investigationsTest.answers) {
  const question = await QuizModel.findById(answer.questionId);
  if (question) {
      const correctAnswers = question.options
          .filter(opt => opt.correct)
          .map(opt => opt.text);

      let scoreForThisQuestion = 0;

      for (const userAnswer of answer.userAnswers) {
          if (correctAnswers.includes(userAnswer)) {
              scoreForThisQuestion += INVESTIGATION_QUESTION_SCORE; // Add score for every correct answer
          } else {
              scoreForThisQuestion -= INVESTIGATION_QUESTION_SCORE; // Deduct score for every incorrect answer (Optional)
          }
      }

      investigationsTestScore += scoreForThisQuestion;
  }
}


    // For diagnosisTest
    for (const answer of userTest.diagnosisTest.answers) {
      const question = await QuizModel.findById(answer.questionId);
      if (question) {
        const correctOption = question.options.find(opt => opt.correct);
        if (correctOption && correctOption.text === answer.answer) {
          diagnosisTestScore += DIAGNOSIS_QUESTION_SCORE;
        }
      }
    }

    

    userTest.eyeTest.score = eyeTestScore;
    userTest.investigationsTest.score = investigationsTestScore;
    userTest.diagnosisTest.score = diagnosisTestScore;

    await userTest.save();

    res.send({
      eyeTestScore: userTest.eyeTest.score,
      investigationsTestScore: userTest.investigationsTest.score,
      diagnosisTestScore: userTest.diagnosisTest.score,
    });
  })
);


//ADMIN
//WORKS
// 1. Aggregate scores and answers for each specific test within a specific case study
router.get(
  "/test-scores/case-study/:caseStudyId",
  expressAsyncHandler(async (req, res) => {
    const caseStudyId = req.params.caseStudyId;

    // Aggregate for eyeTest
    const aggregationEyeTest = await TestModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: "$eyeTest.answers" },
      // Group by the correctness of each answer and count them
      {
        $group: {
          _id: "$eyeTest.answers.correct",
          count: { $sum: 1 },
        },
      },
      // Aggregate further to count correct answers and total attempted
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] },
          },
          totalAttempted: {
            $sum: "$count",
          },
        },
      },
    ]);

    // Aggregate for investigationsTest
    const aggregationInvestigationsTest = await TestModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: "$investigationsTest.answers" },
      {
        $group: {
          _id: "$investigationsTest.answers.correctAnswers",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] },
          },
          totalAttempted: {
            $sum: "$count",
          },
        },
      },
    ]);

    // Aggregate for diagnosisTest
    const aggregationDiagnosisTest = await TestModel.aggregate([
      { $match: { caseStudyId } },
      { $unwind: "$diagnosisTest.answers" },
      {
        $group: {
          _id: "$diagnosisTest.answers.correct",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] },
          },
          totalAttempted: {
            $sum: "$count",
          },
        },
      },
    ]);

    // Calculate the combined score across all tests for the specific case study
    const allTestsAggregationForCaseStudy = {
      correctCount:
        (aggregationEyeTest[0]?.correctCount || 0) +
        (aggregationInvestigationsTest[0]?.correctCount || 0) +
        (aggregationDiagnosisTest[0]?.correctCount || 0),

      totalAttempted:
        (aggregationEyeTest[0]?.totalAttempted || 0) +
        (aggregationInvestigationsTest[0]?.totalAttempted || 0) +
        (aggregationDiagnosisTest[0]?.totalAttempted || 0),
    };

    //calculate percentages
    const eyeTestPercentage = (aggregationEyeTest[0]?.correctCount || 0) / (aggregationEyeTest[0]?.totalAttempted || 1) * 100;
    const investigationsTestPercentage = (aggregationInvestigationsTest[0]?.correctCount || 0) / (aggregationInvestigationsTest[0]?.totalAttempted || 1) * 100;
    const diagnosisTestPercentage = (aggregationDiagnosisTest[0]?.correctCount || 0) / (aggregationDiagnosisTest[0]?.totalAttempted || 1) * 100;
    const allTestsAggregationForCaseStudyPercentage = (allTestsAggregationForCaseStudy.correctCount / allTestsAggregationForCaseStudy.totalAttempted)*100; // calculate total percentage

    res.status(200).json({
      eyeTest: {
        data: aggregationEyeTest,
        percentage: eyeTestPercentage
      },
      investigationsTest: {
        data: aggregationInvestigationsTest,
        percentage: investigationsTestPercentage
      },
      diagnosisTest: {
        data: aggregationDiagnosisTest,
        percentage: diagnosisTestPercentage
      },
      allTestsForCaseStudy: {
        data: allTestsAggregationForCaseStudy,
        percentage: allTestsAggregationForCaseStudyPercentage
    }});
    
  })
);


//ADMIN
//WORKS
// 2. Global scores and answers across all tests and case studies
router.get(
  "/test-scores/global-scores",
  expressAsyncHandler(async (req, res) => {
    // Aggregate global scores and answers for eyeTest
    const globalAggregationEyeTest = await TestModel.aggregate([
      { $unwind: "$eyeTest.answers" },
      {
        $group: {
          _id: "$eyeTest.answers.correct",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] },
          },
          totalAttempted: {
            $sum: "$count",
          },
        },
      },
    ]);

    // Aggregate global scores and answers for investigationsTest
    const globalAggregationInvestigationsTest = await TestModel.aggregate([
      { $unwind: "$investigationsTest.answers" },
      {
        $group: {
          _id: "$investigationsTest.answers.correctAnswers",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] },
          },
          totalAttempted: {
            $sum: "$count",
          },
        },
      },
    ]);

    // Aggregate global scores and answers for diagnosisTest
    const globalAggregationDiagnosisTest = await TestModel.aggregate([
      { $unwind: "$diagnosisTest.answers" },
      {
        $group: {
          _id: "$diagnosisTest.answers.correct",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          correctCount: {
            $sum: { $cond: [{ $eq: ["$_id", true] }, "$count", 0] },
          },
          totalAttempted: {
            $sum: "$count",
          },
        },
      },
    ]);

    // Calculating global scoring across all tests
    const globalScore = {
      correctCount:
        globalAggregationEyeTest[0]?.correctCount +
        globalAggregationInvestigationsTest[0]?.correctCount +
        globalAggregationDiagnosisTest[0]?.correctCount,
      totalAttempted:
        globalAggregationEyeTest[0]?.totalAttempted +
        globalAggregationInvestigationsTest[0]?.totalAttempted +
        globalAggregationDiagnosisTest[0]?.totalAttempted,
    };

    //ca;culate percentages
    const globalEyeTestPercentage = globalAggregationEyeTest[0]?.correctCount / (globalAggregationEyeTest[0]?.totalAttempted || 1) * 100;
    const globalInvestigationsTestPercentage = globalAggregationInvestigationsTest[0]?.correctCount / (globalAggregationInvestigationsTest[0]?.totalAttempted || 1) * 100;
    const globalDiagnosisTestPercentage = globalAggregationDiagnosisTest[0]?.correctCount / (globalAggregationDiagnosisTest[0]?.totalAttempted || 1) * 100;
    const globalScorePercentage = (globalScore.correctCount/globalScore.totalAttempted)*100;
    //send data and percentages
    res.status(200).json({
      eyeTest: {
        data: globalAggregationEyeTest,
        percentage: globalEyeTestPercentage
      },
      investigationsTest: {
        data: globalAggregationInvestigationsTest,
        percentage: globalInvestigationsTestPercentage
      },
      diagnosisTest: {
        data: globalAggregationDiagnosisTest,
        percentage: globalDiagnosisTestPercentage
      },
      globalScore: {
        data: globalScore,
        percentage: globalScorePercentage
      },
    });
  })
);

//WORKS
//3) Average percentage score for each case study over time. Output shown on the following:
// //The total correct answers across all three tests for each test object.
// The total number of questions across all three tests for each test object.
// An average percentage calculated over time (e.g. for each day).
interface Entry {
  date: Date;
  totalQuestions: number;
  totalCorrect: number;
  averagePercentage: number;
}

router.get("/case-study/:caseStudyId/average-score-over-time", expressAsyncHandler(async (req: any, res: any) => {
  try {
    const caseStudyId = req.params.caseStudyId;

    const aggregationResults = await TestModel.aggregate([
      { $match: { caseStudyId } },
      { $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalQuestions: { $sum: { $add: [ 
            { $size: "$eyeTest.answers" }, 
            { $size: "$investigationsTest.answers" }, 
            { $size: "$diagnosisTest.answers" } 
          ]}},
          totalCorrect: { $sum: { $add: [
            { $sum: { $cond: ['$eyeTest.answers.correct', 1, 0] } },
            { $sum: { $cond: ['$investigationsTest.answers.correct', 1, 0] } },
            { $sum: { $cond: ['$diagnosisTest.answers.correct', 1, 0] } },
          ]}},
        }
      },
      { $project: {
          date: {
            $dateFromParts: {
              'year': '$_id.year', 
              'month': '$_id.month', 
              'day': '$_id.day'
            }
          },
          totalQuestions: 1,
          totalCorrect: 1,
          averagePercentage: { 
            $multiply: [
              { $divide: ['$totalCorrect', '$totalQuestions'] }, 
              100 
            ]
          },
        }
      },
      { $sort: { 'date': 1 } } // Sorting by date
    ]);

    if (!aggregationResults.length) {
      return res.status(404).send({ message: 'Case study not found or no answers given yet.' });
    }

    return res.send({ scoresOverTime: aggregationResults });

  } catch (error) {
    return res.status(500).send({ message: error instanceof Error ? `Server error: ${error.message}` : 'An unexpected server error occurred.' });
  }
}));





// Export the router so it can be used in other files (e.g., server.ts)
export default router;
