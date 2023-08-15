//backend/src/routers/case_studies.router.ts
// Import necessary modules and dependencies
import { Router } from "express"; // Importing the Router class from Express
import expressAsyncHandler from "express-async-handler"; // Middleware for handling asynchronous operations safely
import { sample_case_studies } from "../data"; // Sample case studies data (used for seeding)
import { CaseStudyModel } from "../models/case-study-model"; // Importing the CaseStudyModel

// Create a new router instance using Express's Router
const router = Router();

// API endpoint to populate the case study model with sample data
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // Count the number of existing case studies in the database
    const caseStudyCount = await CaseStudyModel.countDocuments();
    
    // If case studies are already seeded, send a response and exit
    if (caseStudyCount > 0) {
      res.send("Seed is already done");
      return;
    }
    
    // If not already seeded, create case studies using the sample data
    await CaseStudyModel.create(sample_case_studies);
    res.send("Seed is done now");
  })
);

// API endpoint to get all case studies
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // Retrieve all case studies from the database using CaseStudyModel
    const case_studies = await CaseStudyModel.find();
    res.send(case_studies); // Return all the case studies fetched from the database
  })
);

// API endpoint to get a specific case study by its ID
router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    // Find a case study by its ID using CaseStudyModel
    const caseStudy = await CaseStudyModel.findById(req.params.id);
    res.send(caseStudy); // Return the specific case study based on the provided ID
  })
);

// Export the router so it can be used in other files (e.g., server.ts)
export default router;
