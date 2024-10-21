const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query for patients, doctors, and admins, but only include 'email_verified' for patients
        const [userRows] = await db.query(
            `SELECT id, email, password_hash, role, 
            CASE WHEN role = 'patient' THEN email_verified ELSE NULL END AS email_verified 
            FROM (
                SELECT id, email, password_hash, 'patient' AS role, email_verified FROM patients
                UNION ALL
                SELECT id, email, password_hash, 'doctor' AS role, NULL as email_verified FROM doctors
                UNION ALL
                SELECT id, email, password_hash, 'admin' AS role, NULL as email_verified FROM admin
            ) AS users
            WHERE email = ?`, 
            [email]
        );

        if (userRows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = userRows[0];

        // // Check if the email is verified (only for patients)
        // if (user.role === 'patient' && !user.email_verified) {
        //     return res.status(403).json({ error: 'Please verify your email before logging in' });
        // }

        // Check if the email is verified (only for patients)
        if (user.role === 'patient' && !user.email_verified) {
            // Render the EJS page asking the user to verify their email
            return res.render('verify_email', { email: user.email });
        }

        // Compare the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Set user in session
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        // Save session before redirecting
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session save failed' });
            }

            // Redirect based on user role
            if (user.role === 'patient') {
                res.redirect('/patientDashboard');
            } else if (user.role === 'doctor') {
                res.redirect(`/doctorDashboard`);
            } else if (user.role === 'admin') {
                res.redirect('/admin_dashboard');
            } else {
                res.status(400).json({ error: 'Invalid user role' });
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};




// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const [userRows] = await db.query(
//             `SELECT id, email, password_hash, role FROM (
//                 SELECT id, email, password_hash, 'patient' AS role FROM patients
//                 UNION ALL
//                 SELECT id, email, password_hash, 'doctor' AS role FROM doctors
//                 UNION ALL
//                 SELECT id, email, password_hash, 'admin' AS role FROM admin
//             ) AS users
//             WHERE email = ?`, 
//             [email]
//         );

//         if (userRows.length === 0) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const user = userRows[0];

//         // Compare the password using bcrypt
//         const isPasswordValid = await bcrypt.compare(password, user.password_hash);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // Set user in session
//         req.session.user = {
//             id: user.id,
//             email: user.email,
//             role: user.role
//         };

//         // Save session before redirecting
//         req.session.save((err) => {
//             if (err) {
//                 console.error('Session save error:', err);
//                 return res.status(500).json({ error: 'Session save failed' });
//             }

//             // Redirect based on user role
//             if (user.role === 'patient') {
//                 res.redirect('/patientDashboard');
//             } else if (user.role === 'doctor') {
//                 res.redirect(`/doctorDashboard`);
//             } else if (user.role === 'admin') {
//                 res.redirect('/admin_dashboard');
//             } else {
//                 res.status(400).json({ error: 'Invalid user role' });
//             }
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ error: 'Login failed' });
//     }
// };

