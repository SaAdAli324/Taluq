import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Conversation'
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    },
    seen:{
        type:Boolean,
        default:false
    }
    
}, {timestamps:true})

export const Messages = mongoose.model("Messages", messageSchema)