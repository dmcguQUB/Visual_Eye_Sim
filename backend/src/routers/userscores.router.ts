//backend/src/routers/userscores.router.ts
import { Router } from "express"; 
import expressAsyncHandler from "express-async-handler";
import { sample_user_scores } from "../data";
import { UserScoreModel } from "../models/userscores";
import authMid from "../middlewares/auth.mid";
import { RequestWithUser } from '../models/user.model'; // Update this path if needed

//create new router calling router method
const router = Router();


//seed database and define structure
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const userScoreCount = await UserScoreModel.countDocuments();
    if (userScoreCount > 0) {
      res.send("User score seed is already done");
      return;
    }
    await UserScoreModel.create(sample_user_scores);
    res.send("User score seed is done now");
  })
);

// GET request to fetch all scores from the collection
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const userScores = await UserScoreModel.find();
    res.send(userScores);
  })
);

// GET request to fetch a specific user's scores
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

router.post(
  "/",
  (req, res, next) => {
    try {
      return authMid(req, res, next);
    } catch (error) {
      console.error(error); // log error
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  expressAsyncHandler(async (req, res) => {
    // Type assertion for req
    const requestWithUser = req as RequestWithUser;

    try {
   
      const scoreData = requestWithUser.body;
      console.log("score data : ", scoreData);
      // You may need to validate that `user` and `_id` exist here.
      if (requestWithUser.user && requestWithUser.user._id) {
        scoreData.userId = requestWithUser.user._id;
    
      } else {
        throw new Error('User information is missing.');
      }

      const newScore = new UserScoreModel(scoreData);
      const savedScore = await newScore.save();

      if (savedScore) {
        res.status(201).send(savedScore);
      } else {
        throw new Error('Error saving score');
      }
    } catch (error) {
      console.log(error);  // log error message in your console
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      }
    }
  })
);



//need to export router so can be used in server.ts file
export default router;