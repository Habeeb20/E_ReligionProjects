import mongoose from "mongoose";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      validate: {
        validator: async function (value) {
          if (!value) return true;
          const Profile = mongoose.model("Profile");
          return await Profile.exists({ _id: value });
        },
        message: "Profile does not exist",
      },
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "leader", "religious_ground", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "pending",
    },
    uniqueNumber: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    slug: {
      type: String,
      unique: true,
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // if (this.isModified("password")) {
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
  if (!this.slug || this.isModified("email") ) {
    this.slug = slugify(`${this.email}`, { lower: true, strict: true });
  }
  next();
});


userSchema.methods.verifyLeader = async function () {
  if (!["leader", "religious_ground"].includes(this.role)) {
    throw new Error("Only leaders and religious_ground can be verified");
  }
  this.status = "verified"; 
  return await this.save();
};

userSchema.methods.blacklistErrander = async function () {
  if (!["leader", "religious_ground"].includes(this.role)) {
    throw new Error("Only leaders and religious_ground can be blacklisted");
  }
  this.isBlacklisted = true;
  return await this.save();
};

userSchema.methods.unblacklistErrander = async function () {
  if (!["leader", "religious_ground"].includes(this.role)) {
    throw new Error("Only leaders and religious_ground can be unblacklisted");
  }
  this.isBlacklisted = false;
  return await this.save();
};

userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;