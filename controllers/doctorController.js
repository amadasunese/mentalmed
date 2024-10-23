const db = require('../config/db');

// View Doctor Dashboard

exports.getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.session.user.id;

        // Fetch doctor information
        const [doctorRows] = await db.query(
            `SELECT 
                id, first_name, last_name, specialization, email, phone, schedule, role
            FROM 
                doctors
            WHERE 
                id = ?`,
            [doctorId]
           
        );
        const doctor = doctorRows[0] || null;

        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }

        // Fetch upcoming appointments for the doctor
        const [appointments] = await db.query(
            `SELECT 
                appointments.id, 
                appointments.appointment_date, 
                appointments.appointment_time, 
                appointments.status,
                patients.first_name AS patient_first_name, 
                patients.last_name AS patient_last_name, 
                patients.email AS patient_email 
            FROM 
                appointments 
            JOIN 
                patients 
            ON 
                appointments.patient_id = patients.id 
            WHERE 
                appointments.doctor_id = ?`,
            [doctorId]
        );

        res.render('doctorDashboard', { doctor, appointments });
    } catch (error) {
        console.error('Error fetching doctor dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.fetchdoctorname = async (req, res) => {
    try {
        const doctorId = req.session.user;

        // Fetch patient details
        const [doctorRows] = await db.query('SELECT first_name, last_name, email FROM doctors');
        const doctor = doctorRows[0];
        
        console.log('Doctor Details:', doctor);
       

        res.render('doctorDashboard', { doctor });
    } catch (error) {
        console.error('Error fetching doctor dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
};

// View Patient Assessments
exports.getPatientAssessments = async (req, res) => {
    try {
        const doctorId = req.session.user.id;

        // Fetch assessments related to the doctor's patients
        const [assessments] = await db.query(
            `SELECT a.id, a.assessment_date, a.answers, p.first_name, p.last_name, p.email
             FROM assessments a
             JOIN patients p ON a.patient_id = p.id
             WHERE p.id IN (
                 SELECT patient_id FROM appointments WHERE doctor_id = ?
             )
             ORDER BY a.assessment_date DESC`,
            [doctorId]
        );

        res.render('doctorAssessments', { assessments });
    } catch (error) {
        console.error('Error fetching patient assessments:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Start Virtual Conversation
exports.startVirtualConversation = (req, res) => {
    const { patientId } = req.params;

    // Here, you would integrate with a service like WebRTC, Twilio, or similar for video calls
    // For simplicity, we'll just render a placeholder page

    res.render('doctorVirtualConversation', { patientId });
};


// Update Doctor Information
exports.updateDoctorInfo = async (req, res) => {
    try {
        const doctorId = req.session.user.id;
        const { first_name, last_name, email, phone, specialization } = req.body;

        // Update doctor information in the database
        const [result] = await db.query(
            `UPDATE doctors 
             SET first_name = ?, last_name = ?, email = ?, phone = ?, specialization = ?
             WHERE id = ?`,
            [first_name, last_name, email, phone, specialization, doctorId]
        );

        if (result.affectedRows > 0) {
            req.session.message = { type: 'success', content: 'Information updated successfully.' };
        } else {
            req.session.message = { type: 'error', content: 'Failed to update information.' };
        }

        res.redirect('/doctor/dashboard');
    } catch (error) {
        console.error('Error updating doctor information:', error);
        req.session.message = { type: 'error', content: 'Internal Server Error.' };
        res.redirect('/doctor/dashboard');
    }
};


exports.acceptAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const doctorId = req.session.user.id;

        console.log(`Appointment ID: ${appointmentId}, Doctor ID: ${doctorId}`); // Log appointment and doctor info

        // Update the appointment status to 'accepted'
        const [result] = await db.query(
            'UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?',
            ['accepted', appointmentId, doctorId]
        );

        console.log('Database query result:', result); // Log the result of the query

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: 'Appointment accepted successfully.' });
        } else {
            console.log('Failed to update the appointment.'); // Log failure
            return res.json({ success: false, message: 'Failed to accept appointment.' });
        }

    } catch (error) {
        console.error('Error accepting appointment:', error); // Log the error
        return res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
};