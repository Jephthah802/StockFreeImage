
import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addFavorite);
router.get('/', authMiddleware, getFavorites);
router.delete('/:id', authMiddleware, removeFavorite);

export default router;
