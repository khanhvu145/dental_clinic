const express = require('express');
const router = express.Router();
const accountController = require('../../app/controllers/user/AccountController');
const store = require('../../app/middlewares/Multer');

router.get('/logout', accountController.logout);
router.put('/update', store.single('image'), accountController.update);
router.put('/change_password', accountController.changePassword);
router.get('/', accountController.index);

module.exports = router;