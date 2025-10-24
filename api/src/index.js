import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import favoriteRoutes from './routes/favoritesRoutes.js';
import playlistRoutes from './routes/playlistsRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();

//  Allowed origins
const allowedOrigins = [
  'http://127.0.0.1:5501',
  'http://localhost:5501',
  'https://stockfreeimage.onrender.com',
  'https://stock-free-image-otmggxrsa-jephewoh-gmailcoms-projects.vercel.app'
];

//  CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

//  API routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/playlists', playlistRoutes);

/
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
