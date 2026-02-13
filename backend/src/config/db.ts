import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = async () => {
    try{
        const conn =await mongoose.connect(process.env.MONGO_URI!);
        console.log(`😁 MongoDB connected succesfully : ${conn.connection.host}`);
    }catch(error){
        console.error(`😪 Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default db;