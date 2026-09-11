import mongoose, { Schema } from 'mongoose'

const UserSchema =new Schema({
    name:{
        requried:true,
        type:String,

    },
    password:{
        requried:true,
        type:String,

    },
    // profilepic:{
    //     type:String
    // },
    email:{
        type:String,
        required:true,
        unique:true
    }
},
{timestamps:true}
)

export const User=mongoose.model('User',UserSchema)