const express = require('express');
const router = express.Router();
const patientController = require('../../app/controllers/admin/PatientController');
const store = require('../../app/middlewares/Multer');

router.delete('/destroy/:id/', patientController.destroy);
router.post('/delete', patientController.delete);
router.put('/edit/update/:id/', store.single('image'), patientController.update);
router.get('/edit/:id/', patientController.edit);
router.post('/store', store.single('image'), patientController.store);
router.get('/create', patientController.create);
router.get('/details/:id/', patientController.details);
router.get('/search', patientController.search);
router.get('/', patientController.index);

module.exports = router;