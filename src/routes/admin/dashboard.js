const express = require('express');
const router = express.Router();
const dasboardController = require('../../app/controllers/admin/DashboardController');

router.get('/', dasboardController.index);

module.exports = router;