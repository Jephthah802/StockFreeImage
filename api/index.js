
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

// Enable CORS for your frontend origin
app.use(cors({
  origin: 'http://127.0.0.1:5501', // Allow requests from VS Code Live Server
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));

app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/playlists', playlistRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));