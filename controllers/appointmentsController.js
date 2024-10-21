// Import the database connection and others
const db = require('../config/db');
const { sendAppointmentEmail } = require('../config/email');



// Render the book appointment form with the patient's ID from the session
exports.renderAppointmentForm = (req, res) => {
    const patientId = req.session.patientId;
    if (!patientId) {
        return res.redirect('/login');
    }
    res.render('book_appointment', { patientId });
};


exports.bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;
    const patient_id = req.session.user.id;

    // Log session and request data
    console.log('Session Data:', req.session);
    console.log('Request Body:', req.body);

    if (!patient_id) {
        console.warn('No patient_id found in session. Redirecting to /view_appointments');
        return res.redirect('/view_appointments');
    }

    try {
        const query = 'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)';
        const values = [patient_id, doctor_id, appointment_date, appointment_time, 'scheduled'];

        console.log('Executing Query:', query);
        console.log('With Values:', values);

        const result = await db.query(query, values);
        console.log('Appointment booked successfully:', result);

        // Fetch patient and doctor details
        const [patient] = await db.query('SELECT email FROM patients WHERE id = ?', [patient_id]);
        const [doctor] = await db.query('SELECT first_name, last_name, specialization FROM doctors WHERE id = ?', [doctor_id]);

        if (patient.length > 0 && doctor.length > 0) {
            const doctorDetails = {
                firstName: doctor[0].first_name,
                lastName: doctor[0].last_name,
                specialization: doctor[0].specialization
            };
            const appointmentDetails = {
                date: appointment_date,
                time: appointment_time
            };

            // Send email notification
            await sendAppointmentEmail(patient[0].email, doctorDetails, appointmentDetails);
        }

        res.redirect('/view_appointments');

    } catch (error) {
        console.error('Error booking appointment:', error, {
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time
        });
        res.status(500).json({ error: 'Failed to book appointment' });
    }
};


// View Appointments

exports.viewAppointments = async (req, res) => {
    const patientId = req.session.user.id;
    if (!patientId) {
        return res.redirect('/login');
    }
    try {
        const [appointments] = await db.query(
            `SELECT a.id, a.appointment_date, a.appointment_time, a.status, 
                    d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.specialization
             FROM appointments a
             JOIN doctors d ON a.doctor_id = d.id
             WHERE a.patient_id = ?
             ORDER BY a.appointment_date ASC, a.appointment_time ASC`, 
             [patientId]
        );
        res.render('view_appointments', { appointments });
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
};


// Update Appointment
exports.updateAppointment = async (req, res) => {
    const { appointment_date, appointment_time } = req.body;
    const appointment_id = req.params.id;
    try {
        const [result] = await db.query(
            'UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?',
            [appointment_date, appointment_time, appointment_id]
        );
        if (result.affectedRows > 0) {
            res.redirect('/view_appointments');
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
            res.redirect('/view_appointments');
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
};