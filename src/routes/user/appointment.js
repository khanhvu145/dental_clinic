const express = require('express');
const router = express.Router();
const appointmentController = require('../../app/controllers/user/AppointmentController');

router.delete('/delete/:id/', appointmentController.delete);
router.put('/updateStatus/:id/', appointmentController.updateStatus);
router.put('/edit/:id/', appointmentController.edit);
router.get('/', appointmentController.index);

module.exports = router;