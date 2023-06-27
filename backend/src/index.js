import express from 'express';
import loginRouter from './routes/login.js';
import regRouter from './routes/registration.js';
import connectDB from '../mongo_connect/connectDB.js';
import myProfile from './routes/myprofile.js';
import sG from './routes/sg.js';
import Post from './routes/posts.js'
import report from './routes/report.js'

import cors from 'cors'
const app=express();
connectDB();

const PORT=4000;

app.use(cors());

app.use('/api/login',loginRouter);
app.use('/api/reg',regRouter);
app.use('/api/profile',myProfile);
app.use('/api/sg',sG);
app.use('/api/posts',Post);
app.use('/api/report',report)

app.listen(PORT,()=>{
  console.log('At: '+PORT)
}
)

