//backend/src/configs/database.config.ts
//required to make connection to mongoDb server
import { connect, ConnectOptions } from 'mongoose';

//call function to connect to database
export const dbConnect =() => {
  // use ! to confirm that it will always be available this value.  {} as ConnectOptions = create an object as COnnect options
  connect(process.env.MONGO_URI!, {

    // tells Mongoose to use the new URL parser for parsing MongoDB connection strings. This is required when using the MongoDB Node.js driver
    useNewUrlParser: true,
    // tells Mongoose to use the new unified topology engine for monitoring the MongoDB server
    useUnifiedTopology: true
  } as ConnectOptions).then(
    () => console.log("connect success to db"), // if sucessful
    (error) => console.log(error) // if error show error 
  ) 

}