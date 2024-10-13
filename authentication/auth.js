// middleware/auth.js

// Middleware to ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

// Middleware to ensure the user has 'admin' role
const ensureAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Access denied');
    }
};

// Middleware to ensure the user has 'patient' role
const ensurePatient = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'patient') {
        return next();
    } else {
        res.status(403).send('Access denied');
    }
};

module.exports = { ensureAuthenticated, ensureAdmin, ensurePatient };
