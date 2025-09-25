import Favorite from '../models/Favorites.js';

export const addFavorite = async (req, res) => {
  try {
    const { id, url, alt_description, user, links } = req.body;
    if (!id || !url || !links?.html) {
      return res.status(400).json({ message: 'Missing required fields: id, url, or links.html' });
    }

    const favorite = new Favorite({
      userId: req.userId,
      imageId: id,
      imageUrl: url,
      altDescription: alt_description || 'No description',
      unsplashLink: links.html,
      photographer: user?.name || 'Unknown',
    });

    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: error.message || 'Server error adding favorite' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId });
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error fetching favorites' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Server error removing favorite' });
  }
};