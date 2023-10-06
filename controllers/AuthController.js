import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

//registering new user
export const registerUser=async(req,res)=>{
    const {firstname,lastname,email,username,password}=req.body;
    const salt=await bcrypt.genSalt(10);
    const hashedPass=await bcrypt.hash(password,salt)
    const newUser=new UserModel({username
        ,email,
        password:hashedPass,
        firstname,
        lastname})

    try{
        const user =await UserModel.findOne({email:email})
        if(user){
            res.status(400).json("user already exists ")
        }else{
        await newUser.save()
        res.status(200).json(newUser)
        }
    }
    catch(error){
        res.status(500).json(error)
    }

}
//login user

export const loginUser=async(req,res)=>{
    const {email,password}=req.body
    try{
        const user =await UserModel.findOne({email:email})
        if(user){
            const validity =await bcrypt.compare(password,user.password)
        if(!validity){res.status(404).json("wrong password")}
        else{
            const token= jwt.sign({id:user._id,email:user.email},process.env.JWT,{expiresIn:'0.1h'})
            delete user.password
            res.status(200).json({token,user})
        }        
    }}
    catch(error){
        res.status(500).json({message:error.message})
    }
}