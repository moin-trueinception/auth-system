import {Request , Response , NextFunction} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload{
    userId:string,
    role: string
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
        (req as any).userRole = decoded.role;
        next();
    }catch(error){
        return res.status(401).json({success:false , message:"Token expired or invalid"});
    }
};

export const authorize = (...roles: string[]) => {
    return (req:Request , res:Response , next:NextFunction) => {
        const userRole = (req as any).userRole;
        if (!roles.includes(userRole)) {
            return res.status(403).json({success:false , message:"access denied"});
        }
        next();
    };
};
