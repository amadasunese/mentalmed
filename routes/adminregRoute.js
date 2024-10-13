const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

router.post('/registeradmin', async (req, res) => {
    const { username, password, email, role } = req.body;

    // Basic input validation
    if (!username || !password || !email || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if username or email already exists
        const [existingUser] = await db.query(
            'SELECT * FROM admin WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new admin into the database
        await db.query(
            'INSERT INTO admin (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, role]
        );

        // Redirect to the admin dashboard with a success message
        req.flash('success', 'Admin user registered successfully');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ error: 'Failed to register admin user' });
    }
});

module.exports = router;