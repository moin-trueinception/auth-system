import mongoose, {Schema , Document} from "mongoose";

export interface IUser extends Document{
    email:string;
    password:string;
    resetPasswordToken?: string ;
    resetPasswordExpiry?: Date ;
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
    }
});

export const User = mongoose.model<IUser>("User",userSchema);