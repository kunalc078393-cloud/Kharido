import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from "express";
import dotenv from 'dotenv';
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

dotenv.config();
// app.use(express.json());

connectDB();



app.get('/',(req,res)=>{
    res.send("this is the message from backend")
})
app.listen(process.env.PORT,() => {
    console.log("server is currently running")
})
