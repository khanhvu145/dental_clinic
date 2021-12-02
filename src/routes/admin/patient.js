const express = require('express');
const router = express.Router();
const patientController = require('../../app/controllers/admin/PatientController');
const store = require('../../app/middlewares/Multer');
const authAdministration = require('../../app/middlewares/AuthAdministration');

router.delete('/delete/:id/', authAdministration, patientController.delete);
router.delete('/deleteMany', authAdministration, patientController.deleteMany);
router.put('/edit/update/:id/', authAdministration, store.single('image'), patientController.update);
router.get('/edit/:id/', authAdministration, patientController.edit);
router.post('/store', authAdministration, store.single('image'), patientController.store);
router.get('/create', authAdministration, patientController.create);
router.get('/details/:id/', authAdministration, patientController.details);
router.get('/search', authAdministration, patientController.search);
router.get('/', authAdministration, patientController.index);

module.exports = router;