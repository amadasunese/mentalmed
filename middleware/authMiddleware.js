function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).render('401');
}

// Ensure the user is a doctor
function ensureDoctor(req, res, next) {
    if (req.session.user && req.session.user.role === 'doctor') {
        return next();
    }
    res.status(403).render('403');
}

// Ensure the user is an admin
function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).render('403');
}

// Ensure the user is a patient
function ensurePatient(req, res, next) {
    if (req.session.user && req.session.user.role === 'patient') {
        return next();
    }
    res.status(403).render('403');

}

module.exports = { ensureAuthenticated, ensurePatient, ensureDoctor, ensureAdmin };
