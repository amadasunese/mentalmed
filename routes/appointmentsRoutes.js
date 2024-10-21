
const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const { ensureAuthenticated, ensureDoctor, ensurePatient, ensureAdmin } = require('../middleware/authMiddleware');


// Appointment Routes
router.get('/book_appointment', appointmentsController.renderAppointmentForm);
router.post('/bookappointment', appointmentsController.bookAppointment);
router.get('/view_appointments', ensurePatient, appointmentsController.viewAppointments);
router.put('/update_appointment/:id', appointmentsController.updateAppointment);
router.post('/cancel_appointment/:id', appointmentsController.cancelAppointment);




module.exports = router;
