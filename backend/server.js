import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT|| 5001 ;

//Middlewares
app.use(express.json()) //Parses data coming from req.body
app.use(express.urlencoded({extended: true}))// To parse nested data from req.body
app.use(cookieParser());

//Routes

app.use("/api/users",userRoutes)


app.listen(PORT,()=> console.log(`Server started at port number : ${PORT}`))