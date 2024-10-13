const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { ensureAuthenticated, ensurePatient } = require('../middleware/authMiddleware');

// router.use(ensureAuthenticated);

// router.get('/patientDashboard', patientController.viewProfile);
router.get('/patientDashboard', patientController.getPatientDashboard);
router.post('/updateProfile', patientController.updateProfile);
router.get('/register', patientController.renderRegisterForm);
router.post('/register', patientController.registerPatient);
router.get('/logout', patientController.logoutPatient);


// Route for the patient dashboard
// router.get('/dashboard', async (req, res) => {
//     try {
//         // Fetch patient data from the database based on session ID
//         const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [req.session.patientId]);

//         if (rows.length === 0) {
//             return res.status(404).json({ error: 'Patient not found' });
//         }

//         const patient = rows[0];
//         res.render('patientDashboard', { patient });
//     } catch (error) {
//         console.error('Error fetching patient data:', error);
//         res.status(500).json({ error: 'Failed to load dashboard' });
//     }
// });


module.exports = router;
