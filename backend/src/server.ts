//backend/src/server.ts

import dotenv from 'dotenv';
dotenv.config(); // access to the ENV file calling this method
import path from 'path';
import express from "express";
import cors from "cors";
import caseStudiesRouter from "./routers/case_studies.router";
import userRouter from './routers/user.router';
import { dbConnect } from './configs/database.config';//import database config
dbConnect();

const app = express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

//call case study and user routers
app.use("/api/case_studies",caseStudiesRouter)
app.use("/api/users", userRouter);

app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'))
})

//define the port using env file
const port = process.env.PORT;
//pass the port to function
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
});