const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { ensureAuthenticated, ensureDoctor } = require('../middleware/authMiddleware');


router.get('/doctorDashboard', ensureDoctor, doctorController.getDoctorDashboard);

// Update Doctor Information
router.post('/dashboard/update', ensureDoctor, doctorController.updateDoctorInfo);

router.get('/appointments/:id/accept', ensureDoctor, doctorController.acceptAppointment);

// View Patient Assessments
router.get('/assessments', ensureDoctor, doctorController.getPatientAssessments);

// Start Virtual Conversation
router.get('/virtual_conversation/:patientId', doctorController.startVirtualConversation);

module.exports = router;
