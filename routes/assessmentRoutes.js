const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { ensureAuthenticated, ensureDoctor, ensurePatient, ensureAdmin } = require('../middleware/authMiddleware');


// Route to render the self-assessment form
router.get('/self_assessment', (req, res) => {
    res.render('self_assessment', { user: req.session.user });
});

router.get('/self_assessmentquiz', ensureAuthenticated, ensurePatient, (req, res) => {
    res.render('self_assessmentquiz', { user: req.session.user });
});

// Route to handle form submission
router.post('/selfassessmentquiz', ensureAuthenticated, ensurePatient, assessmentController.handleSelfAssessment);



module.exports = router;