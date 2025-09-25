import Playlist from '../models/Playlist.js';

export const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }

    const playlist = new Playlist({
      userId: req.userId,
      name,
      images: [],
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: error.message || 'Server error creating playlist' });
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.userId });
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Server error fetching playlists' });
  }
};

export const addImageToPlaylist = async (req, res) => {
  try {
    const { id, url, alt_description, user, links } = req.body;
    if (!id || !url || !links?.html) {
      return res.status(400).json({ message: 'Missing required fields: id, url, or links.html' });
    }

    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.userId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.images.push({
      imageId: id,
      imageUrl: url,
      altDescription: alt_description || 'No description',
      unsplashLink: links.html,
      photographer: user?.name || 'Unknown',
    });

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error('Error adding image to playlist:', error);
    res.status(500).json({ message: error.message || 'Server error adding image to playlist' });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Server error deleting playlist' });
  }
};