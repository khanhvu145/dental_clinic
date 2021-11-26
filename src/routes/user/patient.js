const express = require('express');
const router = express.Router();
const patientController = require('../../app/controllers/user/PatientController');
const store = require('../../app/middlewares/Multer');

router.put('/detail/update/:id/', store.single('image'), patientController.update);
router.get('/detail/:id/', patientController.detail);
router.get('/', patientController.index);

module.exports = router;