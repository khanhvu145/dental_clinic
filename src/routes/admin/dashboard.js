const express = require('express');
const router = express.Router();
const dasboardController = require('../../app/controllers/admin/DashboardController');
const authAdministration = require('../../app/middlewares/AuthAdministration');


router.get('/', authAdministration, dasboardController.index);

module.exports = router;