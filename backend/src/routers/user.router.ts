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

    //find user email within databsase
    const user = await UserModel.findOne({ email });
// check if user email and password is correct using bycrypt
    if (user) {
      console.log("Found user in database");
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      console.log("Password match:", isPasswordCorrect);

      //if correct passwork provide token for authorisation
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

//register api
router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    //constants we want to get from register form
    const { name, email, password, address } = req.body;
    //need to check if there is already a user with the email
    const user = await UserModel.findOne({ email });
    if (user) {
      //if user in database we want to send a custom error message
      res.status(HTTP_BAD_REQUEST).send("User is already exist, please login!");
      //return out of the function
      return;
    }

    //actual register part of code
    //encrypt the password using bcrypt and salt
    const encryptedPassword = await bcrypt.hash(password, 10);

    //create new user from the form data typed by user
    const newUser: User = {
      name,
      email: email.toLowerCase(), //lowercase to ensure uniform
      password: encryptedPassword, //set password to encrypted
      address,
      isAdmin: false,
    };

    //create new constant dbUser which will wait the creation of new user from the UserModel into db
    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
  })
);



//get information required for user registrations data
router.get('/user-registrations', async (req, res) => {
  try {
    const results = await UserModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(results);
  } catch (error:any) {
    console.error(error.message);
    res.status(500).send('Server Error: ' + error.message);  
  }
});


router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send(generateTokenReponse(user)); // This function already sends back the user data
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found!");
    }
  })
);

//create token response for the user
const generateTokenReponse = (user: User) => {
  //process of creating token is called signing
  const token = jwt.sign(
    {
      //want to encode the user.id, email and if admin
      _id: user._id, // Use _id here
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
    _id: user._id, // Use _id here
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    avatar: user.avatar,  
    token: token,
  };
};

//update the avatar information for user
router.patch(
  "/:id/avatar",
  expressAsyncHandler(async (req, res) => {
    const { avatar } = req.body;
    const user = await UserModel.findById(req.params.id);

    if (user) {
      user.avatar = avatar;
      await user.save();
      res.send(generateTokenReponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found!");
    }
  })
);


// Update user's name
router.patch(
  "/:id/name",
  expressAsyncHandler(async (req, res) => {
    const { name } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.name = name;
      await user.save();
      res.send(generateTokenReponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found!");
    }
  })
);

// Update user's address
router.patch(
  "/:id/address",
  expressAsyncHandler(async (req, res) => {
    const { address } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.address = address;
      await user.save();
      res.send(generateTokenReponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found!");
    }
  })
);


export default router;
