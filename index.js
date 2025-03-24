import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import {v2 as cloudinary} from "cloudinary" ;
import cors from 'cors'

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT|| 5001 ;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//Middlewares
app.use(express.json({limit:"50mb"})) //Parses data coming from req.body
app.use(express.urlencoded({extended: true})) // To parse nested data from req.body
app.use(cookieParser());

//Cors
app.use(cors({
  origin: ['https://threads-aniket.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

//Routes
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)


app.listen(PORT,()=> console.log(`Server started at port number : ${PORT}`))