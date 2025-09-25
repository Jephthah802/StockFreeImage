
import express from 'express';
import { createPlaylist, addImageToPlaylist, getPlaylists, deletePlaylist } from '../controllers/playlistControler.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createPlaylist);
router.post('/:id/images', authMiddleware, addImageToPlaylist);
router.get('/', authMiddleware, getPlaylists);
router.delete('/:id', authMiddleware, deletePlaylist);

export default router;