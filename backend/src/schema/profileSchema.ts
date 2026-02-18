import mongoose, { Schema, Document } from "mongoose";

export interface Iprofile extends Document {
    userId: mongoose.Types.ObjectId;
    fullname: string;
    age: number;
    bio: string;
    avatarUrl?: string;
    address: string;
    contact: string;
    createdAt: Date;
    updatedAt: Date;
}

const profileSchema = new Schema<Iprofile>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model<Iprofile>("Profile", profileSchema);
    
