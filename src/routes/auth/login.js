const express = require('express');
const router = express.Router();
const loginController = require('../../app/controllers/auth/LoginController');

router.post('/auth', loginController.login);
router.get('/', loginController.show);

module.exports = router;