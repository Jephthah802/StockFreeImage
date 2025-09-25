// ```plaintext
// image-search-app-backend/
// ├── config/
// │   └── db.mjs
// │       /**
//  * Database connection configuration for MongoDB using Mongoose.
//  */
// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// export default connectDB;

// ├── middleware/
// │   └── auth.mjs
// │       /**
//  * Middleware to protect routes by verifying JWT tokens.
//  */
// import jwt from 'jsonwebtoken';

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// export default authMiddleware;

// ├── models/
// │   ├── User.mjs
// │   │   /**
//  * Mongoose schema for User model.
//  */
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// export default mongoose.model('User', userSchema);

// │   ├── Favorite.mjs
// │   │   /**
//  * Mongoose schema for Favorite model.
//  */
// import mongoose from 'mongoose';

// const favoriteSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   imageUrl: { type: String, required: true },
//   altDescription: { type: String },
//   unsplashLink: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model('Favorite', favoriteSchema);

// │   └── Playlist.mjs
// │       /**
//  * Mongoose schema for Playlist model.
//  */
// import mongoose from 'mongoose';

// const playlistSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   name: { type: String, required: true },
//   images: [
//     {
//       imageUrl: { type: String, required: true },
//       altDescription: { type: String },
//       unsplashLink: { type: String, required: true },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model('Playlist', playlistSchema);

// ├── routes/
// │   ├── auth.mjs
// │   │   /**
//  * Routes for user authentication (register, login).
//  */
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.mjs';

// const router = express.Router();

// // Register
// router.post('/register', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     user = new User({ email, password });
//     await user.save();

//     const payload = { userId: user._id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(201).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const payload = { userId: user._id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;

// │   ├── images.mjs
// │   │   /**
//  * Routes for fetching images from Unsplash API.
//  */
// import express from 'express';
// import axios from 'axios';
// import authMiddleware from '../middleware/auth.mjs';

// const router = express.Router();

// // Search images
// router.get('/search', authMiddleware, async (req, res) => {
//   const { query, page = 1 } = req.query;
//   const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

//   try {
//     const response = await axios.get(url);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching images from Unsplash' });
//   }
// });

// export default router;

// │   ├── favorites.mjs
// │   │   /**
//  * Routes for managing user favorites.
//  */


// │   └── playlists.mjs
// │       /**
//  * Routes for managing user playlists.
//  */


// export default router;

// // ├── .env
// // │   # Environment variables
// // │   MONGO_URI=mongodb://localhost:27017/image-search-app
// // │   JWT_SECRET=your_jwt_secret_key
// // │   UNSPLASH_ACCESS_KEY=BSx0FyVdtHXqAI1cCr1wpK9MUakoJDfFhFPxdYAc89E
// // │   PORT=5000

// // ├── package.json
// // │   {
// // │     "name": "image-search-app-backend",
// // │     "version": "1.0.0",
// // │     "description": "Backend for Image Search App with Unsplash API",
// // │     "type": "module",
// // │     "main": "server.mjs",
// // │     "scripts": {
// // │       "start": "node server.mjs",
// // │       "dev": "nodemon server.mjs"
// // │     },
// // │     "dependencies": {
// // │       "axios": "^1.4.0",
// // │       "bcryptjs": "^2.4.3",
// // │       "dotenv": "^16.0.3",
// // │       "express": "^4.18.2",
// // │       "jsonwebtoken": "^9.0.0",
// // │       "mongoose": "^7.0.0"
// // │     },
// // │     "devDependencies": {
// // │       "nodemon": "^2.0.22"
// // │     }
// // │   }

// └── server.mjs
//     /**
//  * Main server file for the Image Search App backend.
//  */
// import express from 'express';
// import dotenv from 'dotenv';
// import connectDB from './config/db.mjs';
// import authRoutes from './routes/auth.mjs';
// import imageRoutes from './routes/images.mjs';
// import favoriteRoutes from './routes/favorites.mjs';
// import playlistRoutes from './routes/playlists.mjs';

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/images', imageRoutes);
// app.use('/api/favorites', favoriteRoutes);
// app.use('/api/playlists', playlistRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// ```