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

//  Allowed origins (add your Vercel frontend + local)
const allowedOrigins = [
  'http://127.0.0.1:5501',
  'http://localhost:5501',
  'https://stock-free-image-otmggxrsa-jephewoh-gmailcoms-projects.vercel.app', // your frontend
  'https://stockfreeimage.onrender.com' // backend itself
];

//  CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

//  Handle preflight (OPTIONS) requests globally
app.options('*', cors());

//  Parse JSON
app.use(express.json());

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/playlists', playlistRoutes);

//  Default route
app.get('/', (req, res) => {
  res.send('StockFreeImage API is running...');
});

//  Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
