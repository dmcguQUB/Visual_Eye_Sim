// import dotenv from 'dotenv';
// dotenv.config();
import path from 'path';
import express from "express";
import cors from "cors";
// import foodRouter from './routers/food.router';
import { sample_case_studies } from './data';
// import userRouter from './routers/user.router';
// import orderRouter from './routers/order.router';
// import { dbConnect } from './configs/database.config';
// dbConnect();

//call express
const app = express();
app.use(express.json());

//need to use cors to allow same host htto address
app.use(cors({
    //both are sent
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.get("/api/case_studies",(req,res)=>{
    res.send(sample_case_studies);
})

app.get("/api/case_studies/:useCaseId",(req,res)=>{
const useCaseId = req.params.useCaseId;
const case_studies = sample_case_studies.find(caseStudy => caseStudy.id == useCaseId);
res.send(case_studies);
})
// app.use("/api/foods", foodRouter);
// app.use("/api/users", userRouter);
// app.use("/api/orders", orderRouter);

// app.use(express.static('public'));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname,'public', 'index.html'))
// })

//define the port
const port = process.env.PORT || 5001;
//pass the port to function
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})