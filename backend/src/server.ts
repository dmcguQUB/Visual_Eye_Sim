//import dotenv to access
import dotenv from "dotenv";
dotenv.config({path: '../.env'}); // call function

import express from "express";
import cors from "cors";
import router from "./routers/case_studies.router";
import { dbConnect } from "./configs/database.config"; //import DB configs 

console.log(process.env.MONGO_URI)
//call the DB connection function
dbConnect(); // call function

//call express
const app = express();
app.use(express.json());

//need to use cors to allow same host http address
app.use(cors({
    //both are sent
    credentials:true,
    origin:["http://localhost:4200"]
}));

//use router for calling api
app.use("/api/case_studies",router)

//define the port using env file
const port = process.env.PORT;
//pass the port to function
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
});
