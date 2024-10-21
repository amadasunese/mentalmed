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
// const sendVerificationEmail = require('./config/email');


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

// Make flash messages accessible in all views
// app.use((req, res, next) => {
//   res.locals.successMessage = req.flash('successMessage');
//   next();
// });

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

app.get('/healthcenter',  (req, res) => {
    res.render('healthcenterlocator', { user: req.session.user }); 
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

  
  

  app.get('/doctor/appointments/accept/:id', (req, res) => {
    const appointmentId = req.params.id;
  
    const query = `UPDATE appointments SET status = 'accepted' WHERE id = ?`;
  
    db.query(query, [appointmentId], (err, result) => {
      if (err) {
        console.error('Error accepting appointment:', err);
        return res.status(500).send('Error accepting appointment');
      }
      // Redirect back to the doctor's dashboard after accepting the appointment
      res.redirect('back');
    });
  });

  app.get('/registration-success', (req, res) => {
    res.render('registrationSuccess');
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
