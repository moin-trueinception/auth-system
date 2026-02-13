import {Request , Response , NextFunction} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload{
    userId:string
}

export const protect =(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const autHeader = req.headers.authorization;

    if(!autHeader || !autHeader.startsWith("Bearer ")){
        return res.status(401).json({success:false , message:"Unauthorized"});
    }

    const token = autHeader.split(" ")[1];

    try{

        if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

        const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;

        (req as any).userId = decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({success:false , message:"Token expired or invalid"});
    }
};
