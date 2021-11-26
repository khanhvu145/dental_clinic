const express = require('express');
const router = express.Router();
const accountController = require('../../app/controllers/admin/AccountController');
const store = require('../../app/middlewares/Multer');
const authAdministration = require('../../app/middlewares/AuthAdministration');

router.get('/logout', authAdministration, accountController.logout);
router.put('/change_password', authAdministration, accountController.changePassword);
router.put('/update', authAdministration, store.single('image'), accountController.update);
router.get('/', authAdministration, accountController.index);

module.exports = router;