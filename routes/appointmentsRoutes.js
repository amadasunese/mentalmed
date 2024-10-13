
const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const { ensureAuthenticated, ensureDoctor, ensurePatient, ensureAdmin } = require('../middleware/authMiddleware');

// router.use(ensureAuthenticated);

// Appointment Routes
router.get('/book_appointment', ensureAuthenticated, ensurePatient, appointmentsController.renderAppointmentForm);
router.post('/book_appointment', ensureAuthenticated, ensurePatient, appointmentsController.bookAppointment);
router.get('/view_appointments', ensureAuthenticated, ensurePatient, appointmentsController.viewAppointments);
router.put('/update_appointment/:id', ensureAuthenticated, ensurePatient, appointmentsController.updateAppointment);
router.post('/cancel_appointment/:id', ensureAuthenticated, ensurePatient, appointmentsController.cancelAppointment);




module.exports = router;
