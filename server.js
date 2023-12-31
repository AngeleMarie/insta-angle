
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from './Routes/UserRoute.js';
import PostRoute  from './Routes/postRoute.js';
import cors from "cors"

//routes
const app=express();
//middlewares~
app.use(cors())
app.use(bodyParser.json({limit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
dotenv.config()
mongoose.connect(process.env.MONGO_DB,{useNewUrlParser: true,useUnifiedTopology:true})
.then(()=>{
    app.listen(process.env.PORT,()=>console.log(`listening at ${process.env.PORT}`))

}
    ).catch((error)=>{console.log(error)})
app.use('/api/v1/auth',AuthRoute)
app.use('/api/v1/user',UserRoute)
app.use('/api/v1/post',PostRoute)