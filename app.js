// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDb from "./db.js";
// import colors from "colors";
// import path from "path";
// import morgan from "morgan";
// import errorHandler from "./middleware/errorhandler.js";
// import cookieParser from "cookie-parser";
// import cloudinary from "cloudinary";
// import multer from "multer";
// import { ExpressPeerServer } from "peer";
// import userPaymentrouter from "./routes/userRoutes/userPayment.Routes.js";
// import profileRoute from "./routes/userRoutes/profileRoute.js";
// import authRouter from "./routes/userRoutes/userRoute.js";
// import http from "http";
// import {socketIo } from "socket.io";
// import jwt from "jsonwebtoken"



// const app = express()
// const server = http.createServer(app);
// dotenv.config();

// connectDb()
// const __dirname = path.resolve();

// // app.use(
// //   cors({
// //     origin:["http://localhost:5173", "http://localhost:5174"],   
// //     methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //     credentials: true,
// //   })
// // );


// const io = socketIo(server, {
//    corsOptions : {
//   origin: ["http://localhost:5173", "http://localhost:5174",], // Specific origin
//   credentials: true,  // Allow cookies and auth
//   methods: ["GET", "POST", "PUT", "DELETE"],  // Allow specific methods
//   allowedHeaders: ["Content-Type", "Authorization"],  // Allow specific headers
// }
// })



// app.use(cors(corsOptions));

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.static("public"));

// app.use("/uploads", express.static(path.join(__dirname, "/client/dist")));
// app.use(morgan("dev"));



// app.use('/api/user', authRouter)
// app.use('/api/profile', profileRoute)
// app.use('/api/payment', userPaymentrouter)


// io.use((socket, next) => {
//   const token = socket.handshake.query.token;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//       socket.user = decoded;
//       next();
//     } catch (err) {
//       next(new Error('Authentication error'));
//     }
//   } else {
//     next(new Error('No token provided'));
//   }
// });

// io.on('connection', (socket) => {
//   socket.on('joinChat', ({ leaderId, userId }) => {
//     const room = `chat_${userId}_${leaderId}`;
//     socket.join(room);
//   });

//   socket.on('sendMessage', async (message) => {
//     try {
//       const messageData = new Message({
//         leaderId: message.leaderId,
//         userId: message.userId,
//         content: message.content,
//         sender: message.sender,
//       });
//       await messageData.save();
//       const room = `chat_${message.userId}_${message.leaderId}`;
//       io.to(room).emit('message', messageData);
//     } catch (err) {
//       console.error(err);
//     }
//   });

//   socket.on('disconnect', () => {});
// });


// app.use(errorHandler);
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Database connection
// const startServer = async () => {
//   try {
//     await connectDb();
//     console.log(`Database connected successfully`.bgYellow.black);
//   } catch (error) {
//     console.error(`Database connection failed`.bgRed.white, error);
//     process.exit(1);
//   }

//   const port = process.env.PORT || 8000;
//   server.listen(port, () => {
//     console.log(`Your app is listening on port ${port}`.bgGreen.black);
//   });
// };

// startServer()








































import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./db.js";
import colors from "colors";
import path from "path";
import morgan from "morgan";
import errorHandler from "./middleware/errorhandler.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import userPaymentRouter from "./routes/userRoutes/userPayment.Routes.js";
import Message from "./models/chat/messageSchema.js";
import ChatSession from "./models/chat/chatSessionSchema.js";
import profileRoute from "./routes/userRoutes/profileRoute.js";
import authRouter from "./routes/userRoutes/userRoute.js";
import scamreportRoute from "./routes/others/reportScamRoute.js";
import RequestReport from "./routes/others/RequestReligion.js"
import http from "http";
import multer from "multer";
import fs from "fs";

// Load environment variables
dotenv.config();

// Validate environment variables
const requiredEnv = [
  "PORT",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "MONGO_URL",
];
for (const env of requiredEnv) {
  if (!process.env[env]) {
    console.error(`Missing environment variable: ${env}`.bgRed.white);
    process.exit(1);
  }
}

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Static file serving
app.use("/public", express.static(path.join(path.resolve(), "public")));
app.use("/uploads", express.static(path.join(path.resolve(), "Uploads")));

// Ensure uploads directory exists
const uploadsDir = path.join(path.resolve(), "Uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(UploadsDir, { recursive: true });
}

// Routes
app.use("/api/user", authRouter);
app.use("/api/profile", profileRoute);
app.use("/api/payment", userPaymentRouter);
app.use("/api/scam", scamreportRoute)
app.use("/api/request", RequestReport )

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Socket.IO authentication and events
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  console.log('Socket.IO: Attempting authentication with token:', token ? 'provided' : 'missing');
  if (!token) {
    console.error("Socket.IO: No token provided");
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id, email: decoded.email };
    console.log("Socket.IO: Authenticated user:", socket.user?.email, "Namespace:", socket.nsp.name);
    next();
  } catch (error) {
    console.error("Socket.IO: Authentication failed:", error.message);
    return next(new Error(`Authentication error: ${error.message}`));
  }
});

io.on('connection', (socket) => {
  console.log('Socket.IO: User connected:', socket.user.email, 'Namespace:', socket.nsp.name, 'Socket ID:', socket.id);
  socket.on('joinChat', ({ leaderId, userId }) => {
    const room = `chat-${leaderId}-${userId}`;
    socket.join(room);
    console.log('Socket.IO:', socket.user.email, 'joined room:', room);
  });

  socket.on("sendMessage", async (message) => {
    try {
      const { leaderId, userId, content, sender } = message;
      console.log("Socket.IO: Received sendMessage:", { leaderId, userId, content, sender });
      if (!leaderId || !userId || !content || !sender) {
        throw new Error("Missing required message fields");
      }

      const session = await ChatSession.findOne({
        userId,
        leaderId,
      }).populate("leaderId", "userId");
      if (!session) {
        throw new Error("Chat session not found");
      }
      if (!session.leaderId?.userId) {
        throw new Error("Leader profile missing userId");
      }

      const newMessage = await Message.create({
        chatSessionId: session._id,
        senderId: sender === "user" ? userId : session.leaderId.userId,
        receiverId: sender === "user" ? session.leaderId.userId : userId,
        content,
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate("senderId", "email")
        .populate("receiverId", "email")
        .lean();

      const formattedMessage = {
        _id: populatedMessage._id,
        chatSessionId: populatedMessage.chatSessionId,
        senderId: populatedMessage.senderId._id,
        sender: populatedMessage.senderId._id.toString() === userId.toString() ? "user" : "leader",
        receiverId: populatedMessage.receiverId._id,
        content: populatedMessage.content,
        createdAt: populatedMessage.createdAt,
      };

      io.to(`chat-${leaderId}-${userId}`)
        .to(`chat-${userId}-${leaderId}`)
        .emit("message", formattedMessage);
      console.log("Socket.IO: Message saved and emitted:", formattedMessage);
    } catch (error) {
      console.error("Socket.IO: Error saving message:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket.IO: User disconnected:", socket.user.email, "Reason:", reason, "Socket ID:", socket.id);
  });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDb();
    console.log(`Database connected successfully`.bgYellow.black);
    const port = process.env.PORT || 8000;
    server.listen(port, () => {
      console.log(`Your app is listening on port ${port}`.bgGreen.black);
    });
  } catch (error) {
    console.error(`Database connection failed`.bgRed.white, error);
    process.exit(1);
  }
};

startServer();

export default app;








