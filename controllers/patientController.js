const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { sendVerificationEmail } = require('../config/email');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

// Secret key for JWT stored in .env
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Render the registration form
exports.renderRegisterForm = (req, res) => {
    res.render('register');
};


// Register user/patient
exports.registerPatient = async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the patient into the database
        const [result] = await db.query(
            'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address, false]
        );

        if (result.affectedRows > 0) {
            // Generate a JWT for email verification
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
            console.log(token);

            // Send verification email with the JWT
            const verificationLink = `/verify-email?token=${token}`;
            await sendVerificationEmail(email, verificationLink);

            // res.redirect('/login');
            res.redirect('/registration-success');

        } else {
            res.status(500).json({ error: 'Registration failed' });
        }
    } catch (error) {
        console.error('Error during patient registration:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};


// Verify Email
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { id } = decoded;

        // Update the patient's email_verified status
        const [result] = await db.query(
            'UPDATE patients SET email_verified = true WHERE id = ? AND email_verified = false',
            [id]
        );

        if (result.affectedRows > 0) {
            res.render('verification_result', { verificationSuccess: true });
        } else {
            res.render('verification_result', { verificationSuccess: false });
        }

    } catch (error) {
        console.error('Error during email verification:', error);
        res.render('verification_result', { verificationSuccess: false });
    }
};

// Allow users to resend verification email
exports.resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const [patient] = await db.query('SELECT id, email_verified FROM patients WHERE email = ?', [email]);

        if (patient.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        if (patient[0].email_verified) {
            return res.status(400).json({ error: 'Email is already verified' });
        }

        // Generate a new token and resend the verification email
        const token = jwt.sign({ id: patient[0].id, email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const verificationLink = `${token}`;

        await sendVerificationEmail(email, verificationLink);
        res.render('verification_sent', { email });

    } catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).json({ error: 'Failed to resend verification email' });
    }
};


// View Patient Dashboard
exports.getPatientDashboard = async (req, res) => {
    try {
        const patientId = req.session.user.id;

        // Fetch patient details for the logged-in patient
        const [patientRows] = await db.query('SELECT first_name, last_name, email FROM patients WHERE id = ?', [patientId]);
        
        // Check if patient exists
        if (patientRows.length === 0) {
            return res.status(404).send('Patient not found');
        }
        
        const patient = patientRows[0];
        
        console.log('Patient Details:', patient);
        console.log('Patient ID:', patientId);

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
