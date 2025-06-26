import  User  from "../../models/user.Schema.js";
import { Profile } from "../../models/profile.Schema.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import dotenv from "dotenv"
import express from "express"
import cloudinary from "cloudinary"
import ChatSession from "../../models/chat/chatSessionSchema.js";
import Message from "../../models/chat/messageSchema.js";
import axios from "axios"
import Transaction from "../../models/chat/transactionSchema.js";
import Comment from "../../models/profileDetails/commentSchema.js";
import Share from "../../models/profileDetails/shareSchema.js";
import Like from "../../models/profileDetails/likeSchemea.js";
;
dotenv.config()

const profileRoute = express.Router()


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});









profileRoute.post("/createprofile", async (req, res) => {
  const {
    userEmail,
    title,
    address,
    bio,
    phoneNumber,
    religion,
    category,
    profilePicture,
    state,
    LGA,
    gender, // Add gender to destructuring
  } = req.body;

  try {
    console.log("Request Body:", req.body);

    // Validate required fields
    if (!userEmail || !title || !phoneNumber || !gender || !address || !religion || !category) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    if (phoneNumber.length !== 11) {
      return res.status(400).json({
        status: false,
        message: "Phone number must be exactly 11 characters",
      });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const role = user.role;
    if (!role || !["leader", "user", "religious_ground"].includes(role)) {
      return res.status(400).json({
        status: false,
        message: "Invalid role. Must be 'leader', 'user', or 'religious_ground'",
      });
    }

    // Base profile data
    const profileData = {
      userEmail,
      userId: user._id,
      gender,
      title,
      address,
      bio,
      phoneNumber,
      religion,
      category,
      profilePicture,
      state,
      LGA,
    };

    // Save profile
    const profile = new Profile(profileData);
    await profile.save();

    res.status(201).json({
      status: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Error in /createprofile:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: false,
        message: "Validation error: " + error.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
});





profileRoute.put("/edit", verifyToken, async (req, res) => {
  const {
    title,
    address,
    bio,
    phoneNumber,
    religion,
    category,
    profilePicture,
    state,
    LGA,
    gender,
      gallery,
    accountName,
    accountNumber,
    bankName,
  } = req.body;

  try {
    console.log("Edit Profile Request Body:", req.body);

    if (!title || !phoneNumber  || !address || !religion || !category) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    // if (phoneNumber.length !== 11) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Phone number must be exactly 11 characters",
    //   });
    // }

        if (!/^\d{11}$/.test(phoneNumber)) {
      return res.status(400).json({
        status: false,
        message: 'Phone number must be exactly 11 digits',
      });
    }


       if (gallery && gallery.length > 15) {
      return res.status(400).json({
        status: false,
        message: 'Gallery cannot exceed 15 images',
      });
    }

    // Find the profile by userId (from authenticated user)
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        status: false,
        message: "Profile not found",
      });
    }

    // Update profile fields
    const updatedProfileData = {
      title,
      address,
      bio: bio || profile.bio,
      phoneNumber,
      religion,
      category,
      profilePicture: profilePicture || profile.profilePicture,
      state: state || profile.state,
      LGA: LGA || profile.LGA,
      gender,
       gallery: gallery || profile.gallery,
      accountName: accountName || profile.accountName,
      accountNumber: accountNumber || profile.accountNumber,
      bankName: bankName || profile.bankName,
    };

    // Update profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updatedProfileData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error in /edit:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: false,
        message: "Validation error: " + error.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
});



profileRoute.get("/dashboard", verifyToken, async (req, res) => {
  try {
    // Find user and populate profile
    const user = await User.findById(req.user.id).select("-password"); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        status: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Dashboard data retrieved successfully",
      data: {
        user: {
          email: user.email,
          role: user.role,
          firstname:user.firstname,
          lastname:user.lastname,
        },
        profile: {
          userEmail: profile.userEmail,
          gender: profile.gender,
          title: profile.title,
          address: profile.address,
          bio: profile.bio,
          phoneNumber: profile.phoneNumber,
          religion: profile.religion,
          category: profile.category,
          profilePicture: profile.profilePicture,
          state: profile.state,
          LGA: profile.LGA,
          gallery: profile.gallery,
          accountName: profile.accountName,
          accountNumber: profile.accountNumber,
          bankName: profile.bankName,
          slug:profile.slug,
        },
      },
    });
  } catch (error) {
    console.error("Error in /dashboard:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
});


profileRoute.delete('/delete-account', verifyToken, async (req, res) => {
  try {
    await Profile.deleteOne({ userId: req.user.id });
    await User.deleteOne({ _id: req.user.id });
    res.status(200).json({
      status: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error in /delete-account:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message,
    });
  }
});




profileRoute.get("/stats", async (req, res) => {
  try {
    // Get total number of users (based on profiles)
    const totalUsers = await Profile.countDocuments();

    // Aggregate users by religion
    const usersByReligion = await Profile.aggregate([
      {
        $group: {
          _id: "$religion",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          religion: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: true,
      message: "User statistics retrieved successfully",
      data: {
        totalUsers,
        usersByReligion,
      },
    });
  } catch (error) {
    console.error("Error in /stats:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
});



// Retrieves profiles of all users except the authenticated user
profileRoute.get("/users", verifyToken, async (req, res) => {
  try {
    // Find all profiles except the authenticated user's
    const profiles = await Profile.find({ userId: { $ne: req.user.id } }).select(
      "-userId -userEmail" // Exclude sensitive fields
    );

    res.status(200).json({
      status: true,
      message: "Other users retrieved successfully",
      data: profiles,
    });
  } catch (error) {
    console.error("Error in /users:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
});





profileRoute.get("/leader-religion-stats", async (req, res) => {
  try {
    // Aggregate profiles to count leaders by religion
    const leaderStats = await Profile.aggregate([
      {
        // Match profiles with category is "leader" and religion in ["Islam", "Christianity", "Traditional"]
        $match: {
          category: "leader",
          religion: { $in: ["Islam", "Christianity", "Traditional"] },
        },
      },
      {
        // Group by religion and count
        $group: {
          _id: "$religion",
          count: { $sum: 1 },
        },
      },
      {
        // Format output
        $project: {
          religion: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Initialize result object with zero counts for each religion
    const result = {
      Islam: 0,
      Christianity: 0,
      Traditional: 0,
    };

    // Populate result with actual counts
    leaderStats.forEach((stat) => {
      result[stat.religion] = stat.count;
    });

    res.status(200).json({
      status: true,
      message: "Leader religion statistics retrieved successfully",
      data: {
        leadersByReligion: result,
      },
    });
  } catch (error) {
    console.error("Error in /leader-religion-stats:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
});





profileRoute.get('/leaders', verifyToken, async (req, res) => {
  try {
  
    const users = await User.find({ role: 'leader' })
      .select('-password') 
      .lean(); 

    const leaderIds = users.map(user => user._id);
    const profiles = await Profile.find({ userId: { $in: leaderIds } })
      .lean();

   
    const leaders = users
      .map(user => {
        const profile = profiles.find(p => p.userId.toString() === user._id.toString());
        if (!profile) return null; 
        return {
          _id: profile._id,
          userId: user._id,
          email: user.email,
          role: user.role,
          userCreatedAt: user.createdAt,
          userEmail: profile.userEmail,
          gender: profile.gender,
          title: profile.title,
          firstname: user.firstname,
          lastname: user.lastname,
          address: profile.address,
          bio: profile.bio,
          phoneNumber: profile.phoneNumber,
          religion: profile.religion,
          category: profile.category,
          profilePicture: profile.profilePicture,
          state: profile.state,
          LGA: profile.LGA,
          gallery: profile.gallery, ///array of pictures
          accountName: profile.accountName,
          accountNumber: profile.accountNumber,
          bankName: profile.bankName,
          paystackRecipientCode: profile.paystackRecipientCode,
          profileCreatedAt: profile.createdAt,
          profileUpdatedAt: profile.updatedAt,
          uniqueNumber:user.uniqueNumber,
          status:user.status,
          slug:profile.slug,
        };
      })
      .filter(leader => leader !== null); 



    if (!leaders.length) {
      return res.status(404).json({ status: false, message: 'No leaders with profiles found' });
    }

    res.status(200).json({ status: true, data: leaders });
  } catch (error) {
    console.error('Error fetching leaders:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch leaders: ${error.message}` });
  }
});






profileRoute.get('/leader/:slug', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ slug: req.params.slug }).lean();
    if (!profile) {
      console.log('Profile not found for slug:', req.params.slug);
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }

    const user = await User.findById(profile.userId).select('email firstname lastname role uniqueNumber').lean();
    if (!user) {
      console.log('User not found for userId:', profile.userId);
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const [commentCount, likeCount, shareCount] = await Promise.all([
      Comment.countDocuments({ leaderId: profile._id }),
      Like.countDocuments({ leaderId: profile._id }),
      Share.countDocuments({ leaderId: profile._id }),
    ]);

    const leaderData = {
      _id: profile._id,
      userId: user._id,
      email: user.email,
      role: user.role,
      userCreatedAt: user.createdAt,
      userEmail: profile.userEmail,
      gender: profile.gender,
      title: profile.title,
      firstname: user.firstname,
      lastname: user.lastname,
      address: profile.address,
      bio: profile.bio,
      phoneNumber: profile.phoneNumber,
      religion: profile.religion,
      category: profile.category,
      profilePicture: profile.profilePicture,
      state: profile.state,
      LGA: profile.LGA,
      gallery: profile.gallery || [],
      accountName: profile.accountName,
      accountNumber: profile.accountNumber,
      bankName: profile.bankName,
      paystackRecipientCode: profile.paystackRecipientCode,
      profileCreatedAt: profile.createdAt,
      profileUpdatedAt: profile.updatedAt,
      uniqueNumber: user.uniqueNumber,
      slug: profile.slug,
      commentCount,
      likeCount,
      shareCount,
    };

    console.log('Fetched leader profile:', leaderData);
    res.status(200).json({ status: true, data: leaderData });
  } catch (error) {
    console.error('Error fetching leader by slug:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch leader profile: ${error.message}` });
  }
});





profileRoute.get('/leader/:slug/interactions', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ slug: req.params.slug }).lean();
    if (!profile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }

    const [comments, likes, shares] = await Promise.all([
      Comment.find({ leaderId: profile._id })
        .populate('userId', 'email firstname lastname')
        .lean(),
      Like.find({ leaderId: profile._id })
        .populate('userId', 'email firstname lastname')
        .lean(),
      Share.find({ leaderId: profile._id })
        .populate('userId', 'email firstname lastname')
        .lean(),
    ]);

    const interactionData = {
      comments,
      likes,
      shares,
      commentCount: comments.length,
      likeCount: likes.length,
      shareCount: shares.length,
    };

    console.log('Fetched interactions for leader:', interactionData);
    res.status(200).json({ status: true, data: interactionData });
  } catch (error) {
    console.error('Error fetching leader interactions:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch interactions: ${error.message}` });
  }
});


///post comment
profileRoute.post('/leader/:slug/comment', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ slug: req.params.slug });
    if (!profile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }
    const comment = new Comment({
      leaderId: profile._id,
      userId: req.user.id,
      content: req.body.content,
    });
    await comment.save();
    res.status(201).json({ status: true, message: 'Comment posted' });
  } catch (error) {
    console.error('Error posting comment:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to post comment' });
  }
});



//post shares
profileRoute.post('/leader/:slug/share', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ slug: req.params.slug });
    if (!profile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }
    const share = new Share({ leaderId: profile._id, userId: req.user.id });
    await share.save();
    res.status(201).json({ status: true, message: 'Share recorded' });
  } catch (error) {
    console.error('Error sharing profile:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to share profile' });
  }
});


////get comments
profileRoute.get('/leader/:slug/comments', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ slug: req.params.slug });
    if (!profile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }
    const comments = await Comment.find({ leaderId: profile._id })
      .populate('userId', 'email firstname lastname')
      .lean();
    res.status(200).json({ status: true, data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch comments' });
  }
});


//post likes
profileRoute.post('/leader/:slug/like', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ slug: req.params.slug });
    if (!profile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }
    const existingLike = await Like.findOne({ leaderId: profile._id, userId: req.user.id });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      res.status(200).json({ status: true, message: 'Like removed' });
    } else {
      const like = new Like({ leaderId: profile._id, userId: req.user.id });
      await like.save();
      res.status(201).json({ status: true, message: 'Like added' });
    }
  } catch (error) {
    console.error('Error liking profile:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to like profile' });
  }
});


profileRoute.post('/payment', verifyToken, async (req, res) => {

  const { leaderId, email } = req.body;

  try {
    const profile = await Profile.findById(leaderId);
    const paymentData = {
      amount: 500000, // ₦5000 in kobo
      email,
      reference: new Date().getTime().toString(),
      metadata: { leader_id: leaderId, userId: req.user.id },
    };

  if (profile && profile.paystackRecipientCode) {
      paymentData.metadata.paystackRecipientCode = profile.paystackRecipientCode;
    }
    const response = await axios.post(
      'https://api.paystack.com/v1/transaction/initialize',
      paymentData,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    res.status(200).json({ status: true, data: response.data.data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to initiate payment' });
  }
});




// Verify payment and create chat session
profileRoute.post('/payment/verify', verifyToken, async (req, res) => {
  const { reference, leaderId } = req.body;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    if (response.data.status && response.data.data.status === 'success') {
      const metadata = response.data.data.metadata || {};
      const leaderProfile = await Profile.findById(leaderId);

      if (leaderProfile && metadata.paystackRecipientCode) {
        // Initiate transfer to leader
        await axios.post(
          'https://api.paystack.co/transfer',
          {
            source: 'balance',
            amount: 500000, // ₦5000
            recipient: metadata.paystackRecipientCode,
            reason: `Chat session payment for ${leaderId}`,
          },
          { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
        );
      }

      // Create chat session
      const chatSession = new ChatSession({
        userId: req.user.id,
        leaderId,
        paymentReference: reference,
      });
      await chatSession.save();

      res.status(200).json({ status: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ status: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ status: 'error', message: 'Failed to verify payment' });
  }
});




profileRoute.get('/religious-ground', verifyToken, async (req, res) => {
  try {
    const { search, religion, state, lga } = req.query;
    const query = { role: 'religious_ground' };

    if (search) {
      query.$or = [
        { 'profile.localGovtArea': { $regex: search, $options: 'i' } },
        { 'profile.state': { $regex: search, $options: 'i' } },
        { 'profile.religion': { $regex: search, $options: 'i' } },
        { 'profile.firstname': { $regex: search, $options: 'i' } },
        { 'profile.lastname': { $regex: search, $options: 'i' } },
        { 'profile.ministryname': { $regex: search, $options: 'i' } },
      ];
    }
    if (religion) query['profile.religion'] = { $regex: religion, $options: 'i' };
    if (state) query['profile.state'] = { $regex: state, $options: 'i' };
    if (lga) query['profile.localGovtArea'] = { $regex: lga, $options: 'i' };

    const leaders = await User.aggregate([
      { $match: { role: 'religious_ground' } },
      {
        $lookup: {
          from: 'profiles',
          localField: '_id',
          foreignField: 'userId',
          as: 'profile',
        },
      },
      { $unwind: '$profile' },
      { $match: query },
      {
        $project: {
          _id: 0,
          title: '$profile.title',
          firstname: '$profile.firstname',
          lastname: '$profile.lastname',
          localGovtArea: '$profile.localGovtArea',
          state: '$profile.state',
          religion: '$profile.religion',
          ministryname: '$profile.ministryname',
          email: '$profile.email',
        },
      },
    ]);

    res.status(200).json({ status: true, data: leaders });
  } catch (error) {
    console.error('Error fetching religious leaders:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch religious leaders' });
  }
});





// Get user's chat sessions
// Get user's chat sessions
profileRoute.get('/chat/sessions', verifyToken, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id })
      .populate({
        path: 'leaderId',
        populate: { path: 'userId', select: 'email firstname lastname phoneNumber' },
      })
      .lean();

    const formattedSessions = sessions
      .map(session => {
        if (!session.leaderId) return null;
        return {
          _id: session._id,
          userId: session.userId,
          leaderId: {
            _id: session.leaderId._id,
            userId: session.leaderId.userId?._id,
            email: session.leaderId.userId?.email || session.leaderId.userEmail,
            title: session.leaderId.title,
            firstname: session.leaderId.userId?.firstname,
            lastname: session.leaderId.userId?.lastname,
            profilePicture: session.leaderId.profilePicture,
            gallery: session.leaderId.gallery,
            userEmail: session.leaderId.userEmail,
            gender: session.leaderId.gender,
            address: session.leaderId.address,
            bio: session.leaderId.bio,
            phoneNumber: session.leaderId.phoneNumber,
            religion: session.leaderId.religion,
            category: session.leaderId.category,
            state: session.leaderId.state,
            LGA: session.leaderId.LGA,
            accountName: session.leaderId.accountName,
            accountNumber: session.leaderId.accountNumber,
            bankName: session.leaderId.bankName,
            paystackRecipientCode: session.leaderId.paystackRecipientCode,
            profileCreatedAt: session.leaderId.createdAt,
            profileUpdatedAt: session.leaderId.updatedAt,
          },
          createdAt: session.createdAt,
        };
      })
      .filter(session => session !== null);

  

    if (!formattedSessions.length) {
      return res.status(200).json({ status: true, data: [] });
    }

    res.status(200).json({ status: true, data: formattedSessions });
  } catch (error) {
    console.error('Error fetching chat sessions:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch chat sessions: ${error.message}` });
  }
});

// Get chat messages
profileRoute.get('/chat/messages/:leaderId', verifyToken, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      userId: req.user.id,
      leaderId: req.params.leaderId,
    });
    if (!session) {
      return res.status(404).json({ status: false, message: 'Chat session not found' });
    }

    const messages = await Message.find({ chatSessionId: session._id })
      .populate('senderId', 'email')
      .populate('receiverId', 'email')
      .lean();

    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      chatSessionId: msg.chatSessionId,
      senderId: msg.senderId._id,
      sender: msg.senderId._id.toString() === req.user.id.toString() ? 'user' : 'leader',
      receiverId: msg.receiverId._id,
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    res.status(200).json({ status: true, data: formattedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch messages: ${error.message}` });
  }
});

profileRoute.get('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      console.log("profile not found")
      return res.status(404).json({ status: false, message: 'Profile not found' });
    }
    res.status(200).json({ status: true, data: profile });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch profile' });
  }
});




profileRoute.get('/chat/messages/by-user/:sessionUserId', verifyToken, async (req, res) => {
  try {
    const leaderProfile = await Profile.findOne({ userId: req.user.id });
    if (!leaderProfile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }
    const session = await ChatSession.findOne({
      userId: req.params.sessionUserId,
      leaderId: leaderProfile._id,
    });
    if (!session) {
      console.log('Chat session not found for userId:', req.params.sessionUserId, 'leaderId:', leaderProfile._id);
      return res.status(404).json({ status: false, message: 'Chat session not found' });
    }
    const messages = await Message.find({ chatSessionId: session._id })
      .populate('senderId', 'email')
      .populate('receiverId', 'email')
      .lean();
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      chatSessionId: msg.chatSessionId,
      senderId: msg.senderId._id,
      sender: msg.senderId._id.toString() === req.user.id.toString() ? 'leader' : 'user',
      receiverId: msg.receiverId._id,
      content: msg.content,
      createdAt: msg.createdAt,
    }));
    console.log('Fetched messages for session:', session._id, 'Messages:', formattedMessages);
    res.status(200).json({ status: true, data: formattedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch messages: ${error.message}` });
  }
});




profileRoute.get('/leader/payments', verifyToken, async (req, res) => {
  try {
    const leaderProfile = await Profile.findOne({ userId: req.user.id });
    if (!leaderProfile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }

    // Find chat sessions where the leader is involved
    const sessions = await ChatSession.find({ leaderId: leaderProfile._id })
      .populate('userId', 'email firstname lastname')
      .lean();

    // Find transactions for the leader
    const transactions = await Transaction.find({ leaderId: leaderProfile._id })
      .populate('userId', 'email firstname lastname')
      .lean();

    const formattedPayments = await Promise.all(
      transactions.map(async (transaction) => {
        const userProfile = await Profile.findOne({ userId: transaction.userId._id }).lean();
        const paymentDestination = userProfile?.paystackRecipientCode
          ? { method: 'Paystack', recipientCode: userProfile.paystackRecipientCode }
          : userProfile?.accountNumber && userProfile?.bankName
            ? {
                method: 'Bank Account',
                accountName: userProfile.accountName || 'Unknown',
                accountNumber: userProfile.accountNumber,
                bankName: userProfile.bankName,
              }
            : { method: 'Unknown' };

        return {
          _id: transaction._id,
          userId: {
            _id: transaction.userId._id,
            email: transaction.userId.email,
            firstname: transaction.userId.firstname,
            lastname: transaction.userId.lastname,
            profilePicture: userProfile ? userProfile.profilePicture || null : null,
            gallery: userProfile ? userProfile.gallery || [] : [],
          },
          leaderId: leaderProfile._id,
          amount: transaction.amount,
          paymentDate: transaction.paymentDate,
          paymentMethod: paymentDestination.method,
          paymentDetails:
            paymentDestination.method === 'Paystack'
              ? { recipientCode: paymentDestination.recipientCode }
              : paymentDestination.method === 'Bank Account'
                ? {
                    accountName: paymentDestination.accountName,
                    accountNumber: paymentDestination.accountNumber,
                    bankName: paymentDestination.bankName,
                  }
                : null,
        };
      })
    );

    console.log('Fetched leader payments:', formattedPayments);

    res.status(200).json({ status: true, data: formattedPayments });
  } catch (error) {
    console.error('Error fetching leader payments:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch leader payments: ${error.message}` });
  }
});


// Get leader's chat sessions

profileRoute.get('/leader/chats', verifyToken, async (req, res) => {
  try {
    const leaderProfile = await Profile.findOne({ userId: req.user.id });
    if (!leaderProfile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }

    const sessions = await ChatSession.find({ leaderId: leaderProfile._id })
      .populate('userId', 'email firstname lastname')
      .lean();

    const formattedSessions = await Promise.all(
      sessions.map(async (session) => {
        if (!session.userId) {
          console.warn('Chat session missing userId:', session._id);
          return null;
        }
        const userProfile = await Profile.findOne({ userId: session.userId._id }).lean();
        return {
          _id: session._id,
          userId: {
            _id: session.userId._id,
            email: session.userId.email,
            firstname: session.userId.firstname,
            lastname: session.userId.lastname,
            profilePicture: userProfile ? userProfile.profilePicture || null : null,
            gallery: userProfile ? userProfile.gallery || [] : [],
          },
          leaderId: leaderProfile._id,
          createdAt: session.createdAt,
        };
      })
    );

    const filteredSessions = formattedSessions.filter(session => session !== null);

    console.log('Fetched leader chat sessions:', filteredSessions);

    res.status(200).json({ status: true, data: filteredSessions });
  } catch (error) {
    console.error('Error fetching leader chats:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch leader chats: ${error.message}` });
  }
});



profileRoute.get('/leader/messages/:userId', verifyToken, async (req, res) => {
  try {
    const leaderProfile = await Profile.findOne({ userId: req.user.id });
    if (!leaderProfile) {
      return res.status(404).json({ status: false, message: 'Leader profile not found' });
    }

    const session = await ChatSession.findOne({
      userId: req.params.userId,
      leaderId: leaderProfile._id,
    });
    if (!session) {
      return res.status(404).json({ status: false, message: 'Chat session not found' });
    }

    const messages = await Message.find({ chatSessionId: session._id })
      .populate('senderId', 'email')
      .populate('receiverId', 'email')
      .lean();

    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      chatSessionId: msg.chatSessionId,
      senderId: msg.senderId._id,
      sender: msg.senderId._id.toString() === req.user.id.toString() ? 'leader' : 'user',
      receiverId: msg.receiverId._id,
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    res.status(200).json({ status: true, data: formattedMessages });
  } catch (error) {
    console.error('Error fetching leader messages:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch messages: ${error.message}` });
  }
});



profileRoute.get('/:sessionUserId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.sessionUserId).lean();
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    const profile = await Profile.findOne({ userId: req.params.sessionUserId }).lean();
    if (!profile) {
      return res.status(404).json({ status: false, message: 'Profile not found' });
    }
    const userData = {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      profilePicture: profile.profilePicture || null,
      gallery: profile.gallery || [],
    };
    console.log('Fetched user profile:', userData);
    res.status(200).json({ status: true, data: userData });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch user profile: ${error.message}` });
  }
});


profileRoute.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId })
      .populate('userId', 'email')
      .lean();
    if (!profile) {
      return res.status(404).json({ status: false, message: 'User profile not found' });
    }
    res.status(200).json({
      status: true,
      data: {
        _id: profile._id,
        userId: profile.userId?._id,
        email: profile.userId?.email || profile.userEmail,
        title: profile.title,
        firstname: profile.firstname,
        lastname: profile.lastname,
        profilePicture: profile.profilePicture,
        gallery: profile.gallery,
        userEmail: profile.userEmail,
        gender: profile.gender,
        address: profile.address,
        bio: profile.bio,
        phoneNumber: profile.phoneNumber,
        religion: profile.religion,
        category: profile.category,
        state: profile.state,
        LGA: profile.LGA,
        accountName: profile.accountName,
        accountNumber: profile.accountNumber,
        bankName: profile.bankName,
        paystackRecipientCode: profile.paystackRecipientCode,
        profileCreatedAt: profile.createdAt,
        profileUpdatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ status: 'error', message: `Failed to fetch user profile: ${error.message}` });
  }
});







// GET /api/religion-stats
profileRoute.get('/religion-stats', async (req, res) => {
  try {
    const religionCounts = await Profile.aggregate([
      { $match: { religion: { $exists: true, $ne: null } } },
      { $group: { _id: '$religion', count: { $sum: 1 } } },
      { $project: { religion: '$_id', count: 1, _id: 0 } },
    ]);

    const totalProfiles = await Profile.countDocuments({});

    const stats = {
      islam: 0,
      christianity: 0,
      traditional: 0,
      total: totalProfiles,
    };

    religionCounts.forEach((item) => {
      const religionLower = item.religion?.toLowerCase();
      if (religionLower === 'islam') stats.islam = item.count;
      else if (religionLower === 'christianity') stats.christianity = item.count;
      else if (religionLower === 'traditional') stats.traditional = item.count;
    });

    console.log('Religion stats:', stats);

    res.status(200).json({
      message: 'Religion statistics fetched successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching religion stats:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: 'Failed to fetch religion statistics',
      error: error.message,
    });
  }
});





profileRoute.get('/leaders/count-by-state', verifyToken, async (req, res) => {
  try {
    const counts = await Profile.aggregate([
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          state: '$_id',
          count: 1,
        },
      },
    ]);

    const stateCounts = counts.reduce((acc, { state, count }) => {
      acc[state] = count;
      return acc;
    }, {});

    const responseData = [
      { name: 'Lagos Religious leaders', count: stateCounts['Lagos'] || 0, image: '/path-to-im.png' },
      { name: 'Abuja Religious leaders', count: stateCounts['Abuja'] || 0, image: '/path-to-im1.png' },
      { name: 'Calabar Religious leaders', count: stateCounts['Calabar'] || 0, image: '/path-to-im2.png' },
      { name: 'Port-Harcourt Religious leaders', count: stateCounts['Port-Harcourt'] || 0, image: '/path-to-im3.png' },
      { name: 'Owerri Religious leaders', count: stateCounts['Owerri'] || 0, image: '/path-to-im4.png' },
      { name: 'Uyo Religious leaders', count: stateCounts['Uyo'] || 0, image: '/path-to-im5.png' },
    ];

    console.log('Leader counts by state:', responseData);
    res.status(200).json({ status: true, data: responseData });
  } catch (error) {
    console.error('Error counting leaders by state:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to count leaders by state' });
  }
});

export default profileRoute





























