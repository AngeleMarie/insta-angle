import UserModel from "../models/userModel.js"
import bcrypt from "bcrypt"
//get a user

export const getUser=async(req,res)=>{
    const id=req.params.id;
    try{
    const user =await UserModel.findById(id);

if(user){
    const {password,...otherDetails}=user._doc
   res.status(200).json(otherDetails)
}
else{
    res.status(404).json("no such user exist")
}
}
    catch(error){
        res.status(500).json(error)
    }
}
//update user
 export const  updateUser=async(req,res)=>{
    const id=req.params.id;
    const {currentUserId,currentUserAdminStatus,password}=req.body;
    if(id===currentUserId||currentUserAdminStatus){
        try{
            if(password){
                const salt= await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(password,salt)
            }
            const user=await UserModel.findByIdAndUpdate(id,req.body,{new:true})
            res.status(200).json(user)
        }
        catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("Acesss denied you can only upadte your own profile")
    }
 }
 //delete user
 export const deleteUser=async(req,res)=>{
    const id=req.params.id
    const{currentUserId,currentUserAdminStatus}=req.body
    if(currentUserId===id||currentUserAdminStatus){
        try{
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("User deleted successfully")
        }catch(error){
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Access Denied!!! you can only delete your own profile")
    }
 }
 //follow user
 
export async function followUser(req, res) {
  const { id } = req.params;
  const { currentUserId } = req.body;

  if (currentUserId === id) {
    return res.status(403).json({ error: "You cannot follow yourself" });
  }

  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(currentUserId);

    if (!followUser || !followingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (followUser.followers.includes(currentUserId)) {
      return res.status(409).json({ error: "You are already following this user" });
    }

    followUser.followers.push(currentUserId);
    followingUser.following.push(id);

    await Promise.all([followUser.save(), followingUser.save()]);

    res.status(200).json({ message: "You are now following this user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//unfollow user
export async function unfollowUser(req, res) {
    const { id } = req.params;
    const { currentUserId } = req.body;
  
    if (currentUserId === id) {
      return res.status(403).json({ error: "You cannot unfollow yourself" });
    }
  
    try {
      const unfollowUser = await UserModel.findById(id);
      const unfollowedUserIndex = unfollowUser.followers.indexOf(currentUserId);
      const followingUser = await UserModel.findById(currentUserId);
  
      if (!unfollowUser || !followingUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (unfollowedUserIndex === -1) {
        return res.status(409).json({ error: "You are not following this user" });
      }
  
      unfollowUser.followers.splice(unfollowedUserIndex, 1);
      const followingIndex = followingUser.following.indexOf(id);
      followingUser.following.splice(followingIndex, 1);
  
      await Promise.all([unfollowUser.save(), followingUser.save()]);
  
      res.status(200).json({ message: "You have unfollowed this user" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  