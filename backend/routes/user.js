const express = require('express');
const { loginUser, getUserPlaylists } = require('../controllers/userController.js');
const requireAuth = require('../middleware/requireAuth.js');

const router = express.Router();

//login
router.post('/login', loginUser);

//require auth for all paths after this
router.use(requireAuth);

//get playlists
router.get('/:id/playlists', getUserPlaylists);

//
module.exports = router;