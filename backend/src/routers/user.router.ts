///Users/dallanmcguckian/Desktop/Visual Eye Studio/Actual project/Actual 2/Visual_Eye_Sim/backend/src/routers/user.router.ts
import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";
const router = Router();

router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }
    const hashedUsers = await Promise.all(
      sample_users.map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {...user, password: hashedPassword};
      })
    );
    
    await UserModel.create(hashedUsers);
    res.send("Seed Is Done!");
  })
);

//post login to server
router.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request for email:", email);

    const user = await UserModel.findOne({ email });

    if (user) {
      console.log("Found user in database");
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      console.log("Password match:", isPasswordCorrect);

      if (isPasswordCorrect) {
        res.send(generateTokenReponse(user));
      } else {
        res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
      }
    } else {
      console.log("No user found in database");
      res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
    }
  })
);


router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("User is already exist, please login!");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false,
    };

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
  })
);

//create token response for the user
const generateTokenReponse = (user: User) => {
  //process of creating token is called signing
  const token = jwt.sign(
    {
      //want to encode the user.id, email and if admin
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    {
      // want to pass secret of the password to decode
      expiresIn: "30d", // expire token in 30 days
    }
  );

  //return all these values including token
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token,
  };
};

export default router;
