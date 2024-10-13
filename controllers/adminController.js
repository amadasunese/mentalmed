const db = require('../config/db');
const bcrypt = require('bcrypt'); 


// Register a New Admin
exports.registerAdmin = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // Check if the admin already exists
        const [existingAdmin] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            req.session.errorMessage = 'Admin with this email already exists.';
            return res.redirect('/admin_dashboard');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new admin into the database
        await db.query(
            'INSERT INTO admin (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );

        // Set a flash message for successful registration
        req.flash('successMessage', 'Admin successfully registered');
        res.redirect('/login');
    } catch (error) {
        console.log.error('Error registering admin:', error);
        req.session.errorMessage = 'Failed to register admin. Please try again.';
        res.redirect('/admin_dashboard');
    }
};


exports.registerDoctor = async (req, res) => {
    const { first_name, last_name, specialization, email, password, phone, schedule } = req.body;

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert doctor details into doctors table
        await db.query(
            'INSERT INTO doctors (first_name, last_name, specialization, email, password_hash, phone, schedule) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, specialization, email, hashedPassword, phone, schedule]
        );

        // Get the newly inserted doctor ID
        const [newDoctor] = await db.query('SELECT LAST_INSERT_ID() AS id');
        const doctorId = newDoctor[0].id;

        // Optionally: Insert admin credentials into the admin table
        // await db.query(
        //     'INSERT INTO admin (username, password_hash, role) VALUES (?, ?, ?)',
        //     [email, hashedPassword, 'doctor'] // Role should be 'doctor'
        // );

        // Set a flash message for successful registration
        req.flash('successMessage', 'Doctor successfully registered');

        // Redirect to the admin dashboard after successful registration
        res.redirect('/admin_dashboard');

    } catch (error) {
        console.error(error); // Log the error for better debugging
        res.status(500).json({ error: 'Failed to register doctor' });
    }
};

  

// Fetch all doctors
// exports.getAllDoctors = async (req, res) => {
//     try {
//         const [doctors] = await db.execute('SELECT * FROM doctors');
//         console.log(doctors);
//         res.json(doctors);
//     } catch (error) {
//         console.error('Error fetching doctors:', error);
//         res.status(500).json({ error: 'Failed to fetch doctors' });
//     }
// };

// exports.getAllDoctors = async (req, res) => {
//     try {
//         console.log('getAllDoctors route hit'); // Log when the route is accessed
//         const [doctors] = await db.query('SELECT * FROM doctors');
//         console.log(doctors);
//         res.json(doctors);
//     } catch (error) {
//         console.error('Error fetching doctors:', error);
//         res.status(500).json({ error: 'Failed to fetch doctors' });
//     }
// };

exports.getAllDoctors = async (req, res) => {
    try {
      // Fetch all doctors from the doctors table
      const [doctors] = await db.query('SELECT * FROM doctors');
      
      // Log the doctors for debugging purposes
    //   console.log('Fetched Doctors:', doctors);
      
      // Send the list of doctors as a JSON response
      res.status(200).json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  };

// exports.getAllDoctors = async (req, res) => {
//     try {
//         const [doctors] = await db.execute('SELECT * FROM doctors');
//         res.render('admin_dashboard', { title: 'Admin Dashboard', doctors });
//     } catch (error) {
//         console.error('Error fetching doctors:', error);
//         res.status(500).send('Failed to load dashboard');
//     }
// };

// Fetch doctor by ID
exports.getDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const [doctor] = await db.query('SELECT * FROM doctors WHERE id = ?', [doctorId]);
        if (doctor.length > 0) {
            res.json(doctor[0]);
        } else {
            res.status(404).json({ error: 'Doctor not found' });
        }
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ error: 'Failed to fetch doctor' });
    }
};

// Add doctor
exports.addDoctor = async (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
    try {
        await db.query(
            'INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, specialization, email, phone, JSON.stringify(schedule)]
        );
        res.redirect('/admin_dashboard');
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Failed to add doctor' });
    }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const { first_name, last_name, specialization, phone, schedule } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, phone = ?, schedule = ? WHERE id = ?',
            [first_name, last_name, specialization, phone, JSON.stringify(schedule), doctorId]
        );
        if (result.affectedRows > 0) {
            res.redirect('/admin_dashboard');
        } else {
            res.status(404).json({ error: 'Doctor not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ error: 'Failed to update doctor' });
    }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM doctors WHERE id = ?', [doctorId]);
        if (result.affectedRows > 0) {
            res.redirect('/admin_dashboard');
        } else {
            res.status(404).json({ error: 'Doctor not found' });
        }
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
};