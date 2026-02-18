import profile from "../schema/profileSchema";
import { Request,Response } from "express";


export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const existingProfile = await profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists"
      });
    }

    const { fullname, age, bio, avatarUrl, address, contact } = req.body;

    const newProfile = await profile.create({
      fullname,
      age,
      bio,
      avatarUrl,
      address,
      contact,
      userId
    });

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: newProfile
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const existingProfile = await profile.findOne({ userId });
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile: existingProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const existingProfile = await profile.findOne({ userId });
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    const { fullname, age, bio, avatarUrl, address, contact } = req.body;
    existingProfile.fullname = fullname ?? existingProfile.fullname;
    existingProfile.age = age ?? existingProfile.age;
    existingProfile.bio = bio ?? existingProfile.bio;
    existingProfile.avatarUrl = avatarUrl ?? existingProfile.avatarUrl;
    existingProfile.address = address ?? existingProfile.address;
    existingProfile.contact = contact ?? existingProfile.contact;
    await existingProfile.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: existingProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const existingProfile = await profile.deleteOne({ userId });
    if (!existingProfile.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await profile.find().populate("userId", "email");
    return res.status(200).json({
      success: true,
      message: "Profiles fetched successfully",
      profiles
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};