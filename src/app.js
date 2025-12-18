import express from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

const app = express(); 

//middlewares 
app.use(express.json()); 


export default app; 