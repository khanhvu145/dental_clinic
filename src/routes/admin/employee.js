const express = require('express');
const router = express.Router();
const employeeController = require('../../app/controllers/admin/EmployeeController');
const store = require('../../app/middlewares/Multer');
const authAdministration = require('../../app/middlewares/AuthAdministration');

router.delete('/destroy/:id/', authAdministration, employeeController.destroy);
router.post('/delete', authAdministration, employeeController.delete);
router.put('/edit/update/:id/', authAdministration, store.single('image'), employeeController.update);
router.get('/edit/:id/', authAdministration, employeeController.edit);
router.post('/store', authAdministration, store.single('image'), employeeController.store);
router.get('/create', authAdministration, employeeController.create);
router.get('/details/:id/', authAdministration, employeeController.details);
router.get('/search', authAdministration, employeeController.search);
router.get('/', authAdministration, employeeController.index);

module.exports = router;