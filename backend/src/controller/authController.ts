import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../schema/authSchema";
import { generateToken } from "../utils/jwt";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer";

/**
 * Registers a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<Response>} - response with success status and message or error status and message
 * @description
 * This endpoint is used to register a new user.
 * It takes an email and password as body parameters.
 * If either email or password is missing, it returns an error.
 * If the user already exists, it returns an error.
 * If everything is valid, it generates a JWT token and returns the user's id, email and token.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;
    console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("❌ User already exists:", existingUser.email);

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Login endpoint
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<Response>} - response with success status and message or error status and message
 * @description
 * This endpoint is used to login a user.
 * It takes an email and password as body parameters.
 * If either email or password is missing, it returns an error.
 * If the user does not exist, it returns an error.
 * If the password is invalid, it returns an error.
 * If everything is valid, it generates a JWT token and returns the user's id, email and token.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "Login successful",
      user: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Forget password endpoint
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<Response>} - response with success status and message or error status and message
 * @description
 * This endpoint is used to reset user's password.
 * It generates a random reset token, hashes it and saves it to the database.
 * It also sends an email to the user with a reset link.
 * If the user does not exist, it returns an error.
 * If something goes wrong, it returns an error.
 */
export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "If account exists reset link has been sent to email",
      });
    }
    // generate random reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hash the reset token before saving to database
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // saved hased token and expiry time to database
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // token expires in 15 minutes 

    await user.save();

    // send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log(resetLink);

    // TODO: send email to user with reset link (npdemailer or any email service can be used)
    await sendEmail(
      user.email,
      "Password Reset Request",
      `You requested a password reset. Click the link to reset your password: ${resetLink}`
    );
    console.log("Reset link generated:", resetLink);

    res.json({
      success: true,
      message: "if account exist reset link has been sent to email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Resets user's password with given token and new password
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {string} token - reset token sent to user's email
 * @param {string} newPassword - new password to be set for user
 * @returns {Promise<Response>} - response with success status and message or error status and message
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "token and new password are required",
      });
    }

    // hash  incoming token (same way as stored)

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find user by hashed token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    //optional but recommended
    //if you use token versioning
    // user.tokenVersion += 1;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
