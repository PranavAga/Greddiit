import express from "express";
import regRouter from '/routes/registration.js'
const app=express();

app.use("/api/reg",regRouter);
