const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Render the registration form
exports.renderRegisterForm = (req, res) => {
    res.render('register');
};

// Register patient
exports.registerPatient = async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
        );
        if (result.affectedRows > 0) {
            res.redirect('/login');
        } else {
            res.status(500).json({ error: 'Registration failed' });
        }
    } catch (error) {
        console.error('Error during patient registration:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};


exports.getPatientDashboard = async (req, res) => {
    try {
        const patientId = req.session.user;

        // Fetch patient details
        const [patientRows] = await db.query('SELECT first_name, last_name, email FROM patients WHERE id = ?', [patientId]);
        const patient = patientRows[0];

        res.render('patientDashboard', { patient });
    } catch (error) {
        console.error('Error fetching patient dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
};


// View Profile
exports.viewProfile = async (req, res) => {
    const patientId = req.session.patientId;
    if (!patientId) {
        return res.redirect('/login');
    }
    try {
        const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [patientId]);
        if (rows.length > 0) {
            res.render('patientDashboard', { patient: rows[0] });
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ error: 'An error occurred while fetching the profile' });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { first_name, last_name, phone, address } = req.body;
    const patientId = req.session.patientId;
    try {
        const [result] = await db.query(
            'UPDATE patients SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?',
            [first_name, last_name, phone, address, patientId]
        );
        if (result.affectedRows > 0) {
            res.redirect('/patientDashboard');
        } else {
            res.status(404).json({ error: 'Patient not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Profile update failed' });
    }
};

// Logout Patient
exports.logoutPatient = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.redirect('/login');
    });
};
