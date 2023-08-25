//backend/src/routers/user.router.ts
// Import necessary modules and dependencies
import { Router } from "express"; // Importing the Router class from Express
import { sample_users } from "../data"; // Sample user data (used for seeding)
import jwt from "jsonwebtoken"; // JWT library for token handling
import expressAsyncHandler from "express-async-handler"; // Middleware for handling asynchronous operations safely
import { User, UserModel } from "../models/user.model"; // Importing the User model and User interface
import { HTTP_BAD_REQUEST } from "../constants/http_status"; // HTTP status constants
import bcrypt from "bcryptjs"; // Library for password hashing

// Create a new router instance using Express's Router
const router = Router();

// API endpoint to populate the user model with sample users
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // Count the number of existing users in the database
    const usersCount = await UserModel.countDocuments();
    
    // If users are already seeded, send a response and exit
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }
    
    // Hash passwords for sample users and create hashedUsers array
    const hashedUsers = await Promise.all(
      sample_users.map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    
    // Create users with hashed passwords
    await UserModel.create(hashedUsers);
    res.send("Seed Is Done!");
  })
);

//1) API endpoint for user login
router.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request for email:", email);

    // Find user by email in the database
    const user = await UserModel.findOne({ email });

    // Check if user exists and validate password using bcrypt
    if (user) {
      console.log("Found user in database");
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      console.log("Password match:", isPasswordCorrect);

      // If password is correct, generate and send an authorization token
      if (isPasswordCorrect) {
        res.send(generateTokenResponse(user));
      } else {
        res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
      }
    } else {
      console.log("No user found in database");
      res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
    }
  })
);

//2) API endpoint for user registration
router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    // Extract form data from the registration form
    const { name, email, password, address } = req.body;

    // Check if user with the email already exists in the database
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("User is already exist, please login!");
      return; // Exit the function
    }

    // Encrypt the password using bcrypt
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with encrypted password
    const newUser: User = {
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false,
    };

    // Create the new user in the database
    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenResponse(dbUser));
  })
);

//3) API endpoint to get user registration data
router.get('/user-registrations', async (req, res) => {
  try {
    // Aggregate user registrations by date
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

//4) API endpoint to get user information by ID
router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    // Find user by ID in the database
    const user = await UserModel.findById(req.params.id);
    
    // If user exists, send a token response including user data
    if (user) {
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found!");
    }
  })
);

// Function to generate token response for the user
const generateTokenResponse = (user: User) => {
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d", // Token expiration in 30 days
    }
  );

  // Return user data along with the token
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    avatar: user.avatar,
    token: token,
  };
};


//5) API endpoint to update user's avatar information
router.patch(
  "/:id/avatar",
  expressAsyncHandler(async (req, res) => {
    const { avatar } = req.body;
    const user = await UserModel.findById(req.params.id);

    // If user exists, update the avatar and send a token response
    if (user) {
      user.avatar = avatar;
      await user.save();
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found!");
    }
  })
);

//6 API endpoint to update user's name
router.patch(
  "/:id/name",
  expressAsyncHandler(async (req, res) => {
    const { name } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.name = name;
      await user.save();
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found!");
    }
  })
);

//7) API endpoint to update user's address
router.patch(
  "/:id/address",
  expressAsyncHandler(async (req, res) => {
    const { address } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.address = address;
      await user.save();
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found!");
    }
  })
);

// Export the router so it can be used in other files (e.g., server.ts)
export default router;
