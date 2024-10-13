// const db = require('../config/db');

// // Get all doctors
// exports.getAllDoctors = async (req, res) => {
//     try {
//         const [doctors] = await db.query('SELECT * FROM doctors');
//         res.json(doctors);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch doctors' });
//     }
// };

// // Get doctor by ID
// exports.getDoctorById = async (req, res) => {
//     const doctorId = req.params.id;
//     try {
//         const [doctor] = await db.query('SELECT * FROM doctors WHERE id = ?', [doctorId]);
//         if (doctor.length > 0) {
//             res.json(doctor[0]);
//         } else {
//             res.status(404).json({ error: 'Doctor not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch doctor details' });
//     }
// };

// // Update doctor profile
// exports.updateDoctorProfile = async (req, res) => {
//     const doctorId = req.params.id;
//     const { first_name, last_name, specialization, email, phone } = req.body;
//     try {
//         await db.query(
//             'UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ? WHERE id = ?',
//             [first_name, last_name, specialization, email, phone, doctorId]
//         );
//         res.json({ message: 'Doctor profile updated successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to update doctor profile' });
//     }
// };

// // Update doctor schedule
// exports.updateDoctorSchedule = async (req, res) => {
//     const doctorId = req.params.id;
//     const { schedule } = req.body;
//     try {
//         await db.query('UPDATE doctors SET schedule = ? WHERE id = ?', [JSON.stringify(schedule), doctorId]);
//         res.json({ message: 'Doctor schedule updated successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to update doctor schedule' });
//     }
// };


// controllers/doctorController.js
const db = require('../config/db'); // Adjust the path as necessary

// View Doctor Dashboard
exports.getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.session.user.id;

        // Fetch upcoming appointments for the doctor
        const [appointments] = await db.query(
            `SELECT a.id, a.appointment_date, a.appointment_time, a.status, 
                    p.first_name AS patient_first_name, p.last_name AS patient_last_name, 
                    p.email AS patient_email 
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             WHERE a.doctor_id = ? AND a.status = 'pending'
             ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
            [doctorId]
        );

        res.render('doctorDashboard', { appointments });
    } catch (error) {
        console.error('Error fetching doctor dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
};



exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.session.user.id;

        // Fetch upcoming appointments for the doctor
        const [appointments] = await db.query(
            `SELECT a.id, a.appointment_date, a.appointment_time, a.status, 
                    p.first_name AS patient_first_name, p.last_name AS patient_last_name, 
                    p.email AS patient_email 
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             WHERE a.doctor_id = ? AND a.status = 'pending'
             ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
            [doctorId]
        );

        res.render('doctorAppointments', { appointments });
    } catch (error) {
        console.error('Error fetching doctor dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Accept an Appointment
exports.acceptAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const doctorId = req.session.user.id;

        // Update the appointment status to 'accepted'
        const [result] = await db.query(
            'UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?',
            ['accepted', appointmentId, doctorId]
        );

        if (result.affectedRows > 0) {
            res.redirect('/doctor/dashboard');
        } else {
            res.status(400).send('Failed to accept appointment');
        }
    } catch (error) {
        console.error('Error accepting appointment:', error);
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
