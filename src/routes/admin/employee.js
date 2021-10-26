const express = require('express');
const router = express.Router();
const employeeController = require('../../app/controllers/admin/EmployeeController');
const store = require('../../app/middlewares/Multer');

router.delete('/destroy/:id/', employeeController.destroy);
router.post('/delete', employeeController.delete);
router.put('/edit/update/:id/', store.single('image'), employeeController.update);
router.get('/edit/:id/', employeeController.edit);
router.post('/store', store.single('image'), employeeController.store);
router.get('/create', employeeController.create);
router.get('/details/:id/', employeeController.details);
router.get('/search', employeeController.search);
router.get('/', employeeController.index);

module.exports = router;