import * as mongoose from "mongoose";

interface IuserInfo {
    email:string,
    name:string,
    password:string,
    usertype:string,
};
const {Schema} =  mongoose;

let userInfoSchema = new Schema<IuserInfo>({
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    password:{type:String,required:true},
    usertype:{type:String,required:true}},
    {timestamps:true}
);

export = mongoose.model<IuserInfo>("UserInfo",userInfoSchema);