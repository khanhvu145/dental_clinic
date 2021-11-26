const express = require('express');
const router = express.Router();
const homeController = require('../../app/controllers/user/HomeController');
const store = require('../../app/middlewares/Multer');

router.post('/create/appointment/:id/', homeController.createAppointment);
router.post('/create/patient', store.single('image'), homeController.create);
router.put('/update/patient/:id/', store.single('image'), homeController.update);
router.get('/close', homeController.close);
router.get('/select/:id/', homeController.select);
router.get('/', homeController.index);

module.exports = router;