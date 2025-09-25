
import express from 'express';
import { searchImages } from '../controllers/imageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', authMiddleware, searchImages);

export default router;