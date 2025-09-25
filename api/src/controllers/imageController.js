
import axios from 'axios';

export const searchImages = async (req, res) => {
  const { query, page = 1 } = req.query;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images from Unsplash' });
  }
};