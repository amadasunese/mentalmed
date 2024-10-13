const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { ensureAuthenticated, ensureDoctor } = require('../middleware/authMiddleware');

// Apply authentication and authorization middleware to all doctor routes
// router.use(ensureAuthenticated);
// router.use(ensureDoctor);
// router.use(ensureRole);

// Doctor Dashboard
router.get('/dashboard', doctorController.getDoctorDashboard);

// Accept an Appointment
router.post('/appointments/:id/accept', doctorController.acceptAppointment);

router.get('/doctorappointments', doctorController.getDoctorAppointments);

// View Patient Assessments
router.get('/assessments', doctorController.getPatientAssessments);

// Start Virtual Conversation
router.get('/virtual_conversation/:patientId', doctorController.startVirtualConversation);

module.exports = router;
