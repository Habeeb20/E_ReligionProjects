import Payment from "../../models/userPayment.schema.js";
import express from "express";
import axios from "axios";
import crypto from "crypto";
import  User  from "../../models/user.schema.js"; 

const userPaymentrouter = express.Router();


const ROLE_BASED_AMOUNTS = {
  user: 500000,        
  leader: 1000000,      
  religious_ground: 1500000, 
  admin: 0,       
};

userPaymentrouter.post("/paystack/pay", async (req, res) => {
  const { email } = req.body; 

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const role = user.role;
    const amount = ROLE_BASED_AMOUNTS[role] || 0;
    if (amount === 0) {
      return res.status(400).json({ message: 'No payment required for this role' });
    }

    const reference = crypto.randomBytes(12).toString('hex');
    const data = {
      email,
      amount, // Amount in kobo based on role
      reference,
      callback_url: `${process.env.CLIENT_URL}/paystacksuccess`,
    };

    const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const payment = new Payment({ email, amount: amount / 100, reference, status: 'pending', user: user._id }); // Link to user
    await payment.save();

    res.status(200).json({
      authorization_url: response.data.data.authorization_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
});



userPaymentrouter.get("/paystack/verify", async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    console.log("Reference is missing");
    return res.status(400).json({ message: "Reference is missing" });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    const paymentData = response.data.data;

    if (paymentData.status === "success") {
      const payment = await Payment.findOneAndUpdate(
        { reference },
        { status: "success" },
        { new: true }
      ).populate("user");

      if (!payment || !payment.user) {
        console.log("Payment or user not found:", payment);
        return res.status(404).json({ message: "Payment or user not found" });
      }

      const redirectUrl = `${process.env.CLIENT_URL}/profileform?email=${encodeURIComponent(payment.email)}&role=${encodeURIComponent(payment.user.role)}`;
      console.log("Redirecting to:", redirectUrl);
      return res.json({
        data: {
          status: "success",
          redirectUrl,
        },
      });
    } else {
      await Payment.findOneAndUpdate(
        { reference },
        { status: "failed" },
        { new: true }
      );
      console.log("Payment failed");
      return res.json({
        data: {
          status: "failed",
          message: "Payment verification failed",
        },
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      data: {
        status: "error",
        message: error.message || "Payment verification failed",
      },
    });
  }
});

export default userPaymentrouter;