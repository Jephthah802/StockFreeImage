
import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  images: [{
    imageId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    altDescription: { type: String, default: 'No description' },
    unsplashLink: { type: String, required: true },
    photographer: { type: String, default: 'Unknown' },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Playlist', playlistSchema);