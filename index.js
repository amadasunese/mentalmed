const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const adminregRoutes = require('./routes/adminregRoute');
const authRoutes = require('./routes/authRoutes');
const flash = require('connect-flash');
const { ensureAuthenticated, ensureDoctor, ensurePatient, ensureAdmin } = require('./middleware/authMiddleware');

const db = require('./config/db');
const bcrypt = require('bcryptjs');

const app = express();


// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Set up session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('index', { user });
});



app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

// The views directory
app.set('views', path.join(__dirname, 'views'));


// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', adminRoutes);
app.use('/', authRoutes);

// routes
app.get('/register', (req, res) => {
    res.render('register', { user: req.session.user })
});


app.get('/contact', (req, res) => {
    res.render('contact', { user: req.session.user })
});

app.get('/faq', (req, res) => {
    res.render('faq', { user: req.session.user })
});

app.get('/find_specialist', (req, res) => {
    res.render('find_specialist', { user: req.session.user })
});

app.get('/about', (req, res) => {
    const user = req.session.user;
    res.render('about', { user })
});

app.get('/summary', ensureAuthenticated, (req, res) => {
    res.render('summary', { user: req.session.user });
});

app.get('/mentalhealthtips', (req, res) => {
    res.render('mental_health_tips', { user: req.session.user });
});

app.get('/therapygroups', (req, res) => {
    res.render('therapy_group', { user: req.session.user });
});

app.get('/supportgroups', (req, res) => {
    res.render('supportgroups', { user: req.session.user });
});

app.get('/admin_dashboard', ensureAuthenticated, ensureAdmin,  (req, res) => {
    res.render('admin_dashboard'); 
});


app.get('/healthcenter', (req, res) => {
    res.render('healthcenterlocator', { user: req.session.user,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    });
  });
  

  app.post('/acceptappointment/:id', async (req, res) => {
    const appointmentId = req.params.id;
    const doctorId = req.session.user.id;

    const updateQuery = 'UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?';

    try {
        // Update the appointment status to 'accepted'
        const [result] = await db.query(updateQuery, ['accepted', appointmentId, doctorId]);

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: 'Appointment accepted successfully.' });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to accept appointment.' });
        }

    } catch (error) {
        console.error('Error updating appointment status:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

  

app.get('/book_appointment', ensureAuthenticated, ensurePatient, async (req, res) => {
    try {
        // Fetch doctors from the database
        const [doctors] = await db.query('SELECT id, first_name, last_name, specialization FROM doctors');

        res.render('book_appointment', { user: req.session.user, doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).send('Failed to fetch doctors');
    }
});


app.get('/registration-success', (req, res) => {
    res.render('registrationSuccess');
});

app.get('/profile', (req, res) => {
    res.render('profile', { user: req.session.user });
});


// Initialise th routes

app.use('/', assessmentRoutes);
app.use('/',  patientRoutes);
app.use('/',  doctorRoutes);
app.use('/', appointmentsRoutes);
app.use('/', adminregRoutes);


// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
