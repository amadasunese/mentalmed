// Import the database connection
const db = require('../config/db');

// Render the book appointment form with the patient's ID from the session
exports.renderAppointmentForm = (req, res) => {
    const patientId = req.session.patientId;
    if (!patientId) {
        return res.redirect('/login');
    }
    res.render('book_appointment', { patientId });
};

// Book Appointment
exports.bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;
    const patient_id = req.session.patientId;
    if (!patient_id) {
        return res.redirect('/login');
    }
    try {
        await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, appointment_date, appointment_time, 'scheduled']
        );
        res.redirect('/view_appointments');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
};

// View Appointments
exports.viewAppointments = async (req, res) => {
    const patientId = req.session.patientId;
    if (!patientId) {
        return res.redirect('/login');
    }
    try {
        const [appointments] = await db.query(
            `SELECT a.id, a.appointment_date, a.appointment_time, a.status, 
                    d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.specialization
             FROM appointments a
             JOIN doctors d ON a.doctor_id = d.id
             WHERE a.patient_id = ?`, 
             [patientId]
        );
        res.render('view_appointments', { appointments }); // Ensure 'view_appointments' template exists
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
    const { appointment_date, appointment_time } = req.body;
    const appointment_id = req.params.id; // Changed to use route param
    try {
        const [result] = await db.query(
            'UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?',
            [appointment_date, appointment_time, appointment_id]
        );
        if (result.affectedRows > 0) {
            res.redirect('/view_appointments'); // Ensure this route exists
        } else {
            res.status(404).json({ error: 'Appointment not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const [result] = await db.query(
            'UPDATE appointments SET status = ? WHERE id = ?',
            ['canceled', appointmentId]
        );
        if (result.affectedRows > 0) {
            res.redirect('/view_appointments'); // Ensure this route exists
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
};