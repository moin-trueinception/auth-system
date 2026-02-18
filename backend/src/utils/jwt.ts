import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}

export const generateToken = (userId:string, role:"user" | "admin") => {
    return jwt.sign({ userId , role}, JWT_SECRET, { expiresIn: "1d" });
};