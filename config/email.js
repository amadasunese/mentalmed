const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'amadasunese@gmail.com',
        pass: 'qxxo axga dzia jjsw'
    }
});

// Function to send appointment confirmation email
const sendAppointmentEmail = (userEmail, doctorDetails, appointmentDetails) => {
    const mailOptions = {
        from: 'amadasunese@gmail.com',
        to: userEmail,
        subject: 'Appointment Confirmation',
        text: `Dear Patient, your appointment with Dr. ${doctorDetails.firstName} ${doctorDetails.lastName} (${doctorDetails.specialization}) 
        on ${appointmentDetails.date} at ${appointmentDetails.time} has been successfully booked.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent: ' + info.response);
    });
};

// Send verification email function
const sendVerificationEmail = (email, verificationToken) => {
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    const mailOptions = {
        from: 'amadasunese@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Please click the following link to verify your email: ${verificationLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Verification email sent: ' + info.response);
    });
};

// Export both functions
module.exports = {
    sendAppointmentEmail,
    sendVerificationEmail
};
