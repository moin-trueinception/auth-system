import {Request , Response} from "express";
import bcrypt from "bcrypt";
import {User} from "../schema/authSchema";
import {generateToken} from "../utils/jwt";

export const register = async (req:Request , res:Response) => {
    
    try{
   const {email,password} = req.body;
   console.log(email,password);

if(!email || !password){
    return res.status(400).json({
        success:false,
        message:"email and password are required"
    });
}

   const existingUser = await User.findOne({email});

   if(existingUser){
    return res.status(400).json({
        success:false,
        message:"User already exists"
    });
   }

   const hashedPassword = await bcrypt.hash(password,10);

   const user = await User.create({
    email,
    password:hashedPassword
   });

   res.status(201).json({
    success:true,
    message:"User created successfully",
    user:user._id
   });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        });
    }

}

export const login = async(req:Request,res:Response) => {

    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"email and password are required"
            });
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            });
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            });
        }

        const token = generateToken(user._id.toString());

        res.json({
            success:true,
            message:"Login successful",
            user:user._id,
            email:user.email,
            token
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        });
    }
        };

