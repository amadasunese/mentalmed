const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const db = require('../config/db');
const { ensureAuthenticated, ensureDoctor, ensurePatient, ensureAdmin } = require('../middleware/authMiddleware');

// Login Route
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// router.use(ensureAuthenticated);

router.post('/login', authController.login);

router.get('/adminDashboard', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin_Dashboard', { user: req.session });
});

module.exports = router;
