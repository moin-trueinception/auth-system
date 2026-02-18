import mongoose, {Schema , Document} from "mongoose";

export interface IUser extends Document{
    email:string;
    password:string;
    resetPasswordToken?: string ;
    resetPasswordExpiry?: Date ;
    role: "user" | "admin";
}

const userSchema = new Schema<IUser>({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpiry:{
        type:Date
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
});

export const User = mongoose.model<IUser>("User",userSchema);