const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { ensureAuthenticated, ensurePatient } = require('../middleware/authMiddleware');




// router.get('/patientDashboard', patientController.viewProfile);
router.get('/patientDashboard', patientController.getPatientDashboard);
router.post('/updateProfile', patientController.updateProfile);
router.get('/register', patientController.renderRegisterForm);
router.get('/verify-email', patientController.verifyEmail);
router.post('/resend-verification', patientController.resendVerificationEmail);
router.post('/register', patientController.registerPatient);
router.get('/logout', patientController.logoutPatient);


module.exports = router;
