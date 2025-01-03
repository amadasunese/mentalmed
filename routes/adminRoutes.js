const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { ensureAuthenticated, ensureDoctor, ensurePatient, ensureAdmin } = require('../middleware/authMiddleware');


router.get('/getAllDoctors', ensureAuthenticated, ensureAdmin, adminController.getAllDoctors);
router.get('/getDoctorById', ensureAuthenticated, ensureAdmin, adminController.getDoctorById);
router.put('/updateDoctor', ensureAuthenticated, ensureAdmin, adminController.updateDoctor);
router.delete('/deleteDoctor', ensureAuthenticated, ensureAdmin, adminController.deleteDoctor);
router.post('/registerDoctor', ensureAuthenticated, ensureAdmin, adminController.registerDoctor);

module.exports = router;
