import express from "express"
import bcrypt from "bcryptjs"
import nodemailer  from "nodemailer"
import crypto from "crypto"
import cloudinary from "cloudinary"
import dotenv from "dotenv"
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose"
import { verifyToken } from "../../middleware/verifyToken.js"
import jwt from "jsonwebtoken"

import  User  from "../../models/user.Schema.js"
import { Profile } from "../../models/profile.Schema.js"
import { MailtrapClient } from "mailtrap"
dotenv.config()


export const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    console.log(req?.user?.role)
    if (req.user?.role?.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  };


const authRouter = express.Router()

const transporter = nodemailer.createTransport({
  service:'http://smtp-relay.brevo.com',
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
      },
 
})

//   const sendOTPEmail = async (email, otp, firstName) => {
//     const mailOptions = {
//       from: "essentialng23@gmail.com",
//       to: email,
//       subject: "Verify your email",
//       html: `
//           <!DOCTYPE html>
//           <html lang="en">
//           <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Email Verification - E_Ride</title>
//           </head>
//           <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f5; color: #333;">
//             <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
//               <tr>
//                 <td style="padding: 20px; text-align: center; background-color: customPink; color: white; border-top-left-radius: 12px; border-top-right-radius: 12px;">
//                   <h1 style="font-size: 28px; margin: 0; font-weight: bold; font-family: 'Helvetica', sans-serif;">E_Ride</h1>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 40px 30px;">
//                   <h2 style="font-size: 24px; color: #333; margin-bottom: 20px; font-weight: 600; font-family: 'Helvetica', sans-serif;">Verify Your Email</h2>
//                   <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
//                     Hello ${firstName || "there"},
//                   </p>
//                   <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 30px;">
//                     Thank you for signing up with E_Ride! To complete your registration and secure your account, please verify your email address by entering the following 6-digit verification code:
//                   </p>
//                   <div style="text-align: center; margin: 30px 0; background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
//                     <span style="display: inline-block; font-size: 32px; font-weight: bold; color: customPink; letter-spacing: 6px; font-family: 'Helvetica', sans-serif;">
//                       ${otp}
//                     </span>
//                   </div>
//                   <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
//                     This code will expire in 24 hours for your security. If you didn’t request this verification, please ignore this email or contact our support team at <a href="mailto:support@e-ride.com" style="color: #7E22CE; text-decoration: none; font-weight: 500;">support@e-ride.com</a>.
//                   </p>
//                   <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 30px;">
//                     If you have any questions, feel free to reach out to us. We’re here to help you get started with E_Ride!
//                   </p>
//                   <div style="text-align: center; margin-top: 30px;">
//                     <a href="http://localhost:5173/verifyemail?email=${encodeURIComponent(
//                       email
//                     )}" 
//                        style="display: inline-block; padding: 12px 30px; background-color: customPink; color: white; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; font-family: 'Helvetica', sans-serif; transition: background-color 0.3s;">
//                       Verify Now
//                     </a>
//                   </div>
//                   <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px; font-family: 'Arial', sans-serif;">
//                     © 2025 E_Ride. All rights reserved.
//                   </p>
//                 </td>
//               </tr>
//             </table>
//           </body>
//           </html>
//         `,
//     };
//     try {
//       const sentMail = await transporter.sendMail(mailOptions);
//       console.log("Email sent successfully:", sentMail);
//       return { success: true };
//     } catch (error) {
//       console.error("Email sending error:", error);
//       return { success: false, error: error.message };
//     }
//   };
  


const TOKEN = process.env.MAILTRAP_TOKEN;
const SENDER_EMAIL = process.env.SENDER_DOMAIN;


const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "E_Religion", email: SENDER_EMAIL };

const sendEmail = async (recipientEmail, otp) => {
try {
    const response = await client.send({
      from: sender,
      to: [{ email: recipientEmail }],
      subject: "Verify your email!",
      text: `Your verification code is: ${otp}`, 
      html: `<h3>Verify your email!</h3><p>Your verification code is: <strong>${otp}</strong></p>`, 
    });
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });



authRouter.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    // Validate role
    const validRoles = ['user', 'leader', 'religious_ground', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ status: false, message: 'Invalid role provided' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token and unique number
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const uniqueNumber = `RL-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      verificationTokenExpiresAt,
      uniqueNumber,
      userId: uuidv4(),
    });

    await newUser.save();

    // Send OTP email
    try {
      await sendEmail(newUser.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      await User.findByIdAndDelete(newUser._id); 
      return res.status(500).json({ status: false, message: 'Failed to send verification email' });
    }

    // Generate JWT
    const payload = { user: { id: newUser._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: "1h" });
    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account',
      token,
      user: { firstname: newUser.firstname, lastname: newUser.lastname, email: newUser.email, role: newUser.role }, // Safe fields only
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ status: false, message: error.message || 'An error occurred during registration' });
  }
});

authRouter.post("/verify-email", async(req, res) => {
    try {
        const { email, code } = req.body;
        console.log("Verifying email:", { email, code });
    
        const user = await User.findOne({
          email,
          verificationToken: code,
          verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
          return res
            .status(404)
            .json({
              status: false,
              message: "User not found or invalid verification code",
            });
        }
    
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
    
        const payload = { user: { id: user._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        res.json({
          success: true,
          message: "Email verified successfully",
          token,
          user: { id: user._id, email: user.email, isVerified: true, role:user.role },
        });
      } catch (err) {
        console.error("Email verification error:", err);
        res
          .status(500)
          .json({ status: false, message: err.message || "Server error occurred" });
      }  
})

authRouter.post("/send-otp", async(req, res) => {
    try {
        const { email } = req.body;
        console.log("Resending OTP for email:", email);
    
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ status: false, message: "User not found" });
        }
    
        const verificationToken = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    
        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = verificationTokenExpiresAt;
        await user.save();
    
        const response = await sendOTPEmail(
          email,
          verificationToken,
          user.firstName
        );
        if (!response.success) {
          console.log("Email sending error:", response.error);
          return res
            .status(400)
            .json({ status: false, message: "Failed to resend verification code" });
        }
    
        res.json({
          status: true,
          message: "Verification code resent successfully",
        });
      } catch (err) {
        console.error("Send OTP error:", err);
        res.status(500).json({ status: false, message: "Server error occurred" });
      }
})



authRouter.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email" });
  
      // const isMatch = await bcrypt.compare(password, user.password);
      // if (!isMatch){
      //   return res.status(400).json({ message: "incorrect password" });
      // }
  
      const profile = await Profile.findOne({ userId: user._id });
      if (!profile && user.role !== "admin") {
        return res.status(400).json({
          status: false,
          message: "Profile not found. Please complete your profile or register with another mail.",
        });
      } 
      const payload =  {id: user._id  };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });


   let roleMessage= "";
   switch (user.role) {
    case "driver":
        roleMessage=`Welcome ${user.firstName},your login is successful as a Driver, you have full access to your driver account`
        break;
     case "client":
        roleMessage=`Welcome ${user.firstName}, you have full access to your passenger account`
        break;
     case "admin":
        roleMessage=`Welcome ${user.email}, you have full access to your admin account, control all activities`
        break;
       
    default:
        break;
   }

      return res.status(200).json({
        status: true,
        message: `successfully logged in. ${roleMessage}`,
        token,
        role: user.role,
        userId:user._id
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error" });
    }
})



export default authRouter