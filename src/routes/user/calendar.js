const express = require('express');
const router = express.Router();
const calendarController = require('../../app/controllers/user/CalendarController');
const store = require('../../app/middlewares/Multer');

router.post('/create', calendarController.create);
router.put('/edit/:id/', calendarController.edit);
router.get('/', calendarController.index);

module.exports = router;