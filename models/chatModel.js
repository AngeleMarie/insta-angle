import mongoose from "mongoose";
const ChatSchema=mongoose.Schema({
    members:{
        type:Array,
    },
},
{
    timeStamps:true,
}
);
const ChatModel=mongoose.model("Chat",ChatModel)
export default ChatModel