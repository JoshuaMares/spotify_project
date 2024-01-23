const express = require('express');

const { loginUser } = require('../controllers/userController.js');
const router = express.Router();

//login
router.post('/login', loginUser);

//
module.exports = router;