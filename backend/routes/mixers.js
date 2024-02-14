const express = require('express');
const { createMixer, getMixerInfo, updateMixer } = require('../controllers/mixersController.js');
const requireAuth = require('../middleware/requireAuth.js');

const router = express.Router();

//require auth for all paths after this
router.use(requireAuth);

//create mixer
router.post('/create', createMixer);

//get mixer info
router.get('/:id', getMixerInfo);

//add users to mixer
router.put('/:id/update', updateMixer);

module.exports = router;