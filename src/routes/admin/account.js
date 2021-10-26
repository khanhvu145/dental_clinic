const express = require('express');
const router = express.Router();
const accountController = require('../../app/controllers/admin/AccountController');
const store = require('../../app/middlewares/Multer');

router.get('/logout', accountController.logout);
router.put('/update/:id/', store.single('image'), accountController.update);
router.get('/', accountController.index);

module.exports = router;