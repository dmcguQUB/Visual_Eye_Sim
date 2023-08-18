//backend/src/server.ts
//This code sets up an Express server to handle various API routes related to case studies, users, questions, and user scores.
//It connects to a MongoDB database using the provided configuration. The server also serves static assets, like images, and supports client-side routing by directing all unmatched routes to the SPA's index.html file. The server listens on the port specified in the environment configuration.
// Import necessary modules and configuration
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import path from 'path';
import express from "express";
import cors from "cors";
import caseStudiesRouter from "./routers/case_studies.router";
import userRouter from './routers/user.router';
import questionsRouter from './routers/questions.router';
import { dbConnect } from './configs/database.config'; // Import database configuration
import userScoresRouter from './routers/userscores.router';
import testRouter from './routers/test.router';
// Connect to the MongoDB database using the database configuration
dbConnect();

// Create an Express application
const app = express();

// Middleware to parse JSON in request bodies
app.use(express.json());

// Configure Cross-Origin Resource Sharing (CORS)
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"] // Specify allowed origins for CORS
}));

// Use routers for different API routes
app.use("/api/case_studies", caseStudiesRouter); // Router for case studies
app.use("/api/users", userRouter); // Router for user-related actions
app.use("/api/questions", questionsRouter); // Router for questions and quizzes
app.use("/api/userscores", userScoresRouter); // Router for user scores and results
app.use("/api/test", testRouter); // Router for user scores and results


// Serve static assets like eye test images from the backend
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle all other URLs by serving the SPA's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define the port number for the server to listen on
const port = process.env.PORT;

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
});
