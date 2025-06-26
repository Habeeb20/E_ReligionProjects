import mongoose from "mongoose";
import slugify from "slugify";


const profileSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
             ref: "User",
            required: true,
            unique: true,
        },
          userEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber:{type:String, required: true},
    title:{type:String, required: true},
    gender:{type:String, required: true},
    bio:{type:String, required: true},
    address:{type:String, required: true},
    profilePicture:String,
      religion:{type:String, required: true},
  category:{type:String, required: true},
    state: { type: String, required: true },
  LGA: { type: String, required: true },

    gallery: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 15,
        message: 'Gallery cannot exceed 15 images',
      },
    },
        accountName: String,
    accountNumber: String,
    bankName: String,
      paystackRecipientCode: String, 

    },
{timestamps: true})

profileSchema.pre("save", async function (next) {
 
  if (!this.slug || this.isModified("userEmail") ) {
    this.slug = slugify(`${this.userEmail}`, { lower: true, strict: true });
  }
  next();
});


export const Profile = mongoose.model('Profile', profileSchema);





















