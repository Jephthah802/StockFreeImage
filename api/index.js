import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import imageRoutes from './src/routes/imageRoutes.js';
import favoriteRoutes from './src/routes/favoritesRoutes.js';
import playlistRoutes from './src/routes/playlistsRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();

// Enable CORS for both local and deployed frontend
const allowedOrigins = [
  'http://127.0.0.1:5501',           // local Live Server
  'http://localhost:5501',           // just in case
  'https://your-frontend.vercel.app' // ← replace with your Vercel frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/playlists', playlistRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
