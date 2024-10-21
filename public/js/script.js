function validateForm() {
    // Get form elements
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpassword').value;
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmpasswordError');

    let isValid = true;

    // Clear any previous error messages
    emailError.textContent = "";
    phoneError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    // Email validation: Must be in correct email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
    }

    // Phone validation: Must be a number
    const phonePattern = /^\d+$/;
    if (!phonePattern.test(phone)) {
        phoneError.textContent = "Please enter a valid phone number.";
        isValid = false;
    }

    // Password validation: Must be at least 6 characters and contain special characters
    const passwordPattern = /^(?=.*[!@#$%^&*])/;
    if (password.length < 6 || !passwordPattern.test(password)) {
        passwordError.textContent = "Password must be at least 6 characters long and contain at least one special character.";
        isValid = false;
    }

    // Confirm password validation: Must match password
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        isValid = false;
    }

    return isValid;
}


// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('registrationForm');
//     const formSummaryContent = document.getElementById('formSummaryContent');
//     const formSummarySection = document.querySelector('.form-summary');
//     const confirmationMessage = document.getElementById('confirmationMessage');
    

//     const formData = {};

    // Fields to track
    // const fields = ['first_name', 'last_name', 'email', 'phone', 'gender', 'country', 'date_of_birth', 'password', 'confirmpassword', 'address', 'terms'];

    // fields.forEach(field => {
    //     const inputElement = document.getElementById(field);
    //     inputElement.addEventListener('input', function () {
    //         captureData(field, inputElement);
    //     });
    // });

    // Handle form submission
    // form.addEventListener('submit', function (event) {
    //     event.preventDefault();
    //     if (validateForm()) {
    //         displayFormSummary();
    //         displayConfirmation();
    //     }
    // });

    // Function to capture data from form fields
    // function captureData(field, inputElement) {
    //     if (inputElement.type === 'checkbox') {
    //         formData[field] = inputElement.checked ? 'Agreed' : 'Not agreed';
    //     } else {
    //         formData[field] = inputElement.value;
    //     }
    // }

    // Function to display the captured form data in the summary section
    // function displayFormSummary() {
    //     formSummaryContent.innerHTML = '';
    //     Object.keys(formData).forEach(key => {
    //         let displayValue = formData[key];

            // Mask passwords with '***'
    //         if (key === 'password' || key === 'confirmpassword') {
    //             displayValue = '***';
    //         }

    //         formSummaryContent.innerHTML += `<p><strong>${key}:</strong> ${displayValue}</p>`;
    //     });
    //     formSummarySection.style.display = 'block';
    // }

    // Form validation function
    // function validateForm() {
    //     let isValid = true;

        // Clear all error messages
        // fields.forEach(field => {
        //     document.getElementById(field + 'Error').textContent = '';
        // });

        // // First Name validation
        // if (!formData.first_name) {
        //     document.getElementById('nameError').textContent = 'Name is required';
        //     isValid = false;
        // }

    //      // Last_Name validation
    //      if (!formData.last_name) {
    //         document.getElementById('nameError').textContent = 'Name is required';
    //         isValid = false;
    //     }

    //     // Email validation
    //     if (!formData.email || !validateEmail(formData.email)) {
    //         document.getElementById('emailError').textContent = 'Invalid email address';
    //         isValid = false;
    //     }

    //     // Phone validation
    //     if (!formData.phone) {
    //         document.getElementById('phoneError').textContent = 'Phone number is required';
    //         isValid = false;
    //     }

    //     // Gender validation
    //     if (!formData.gender) {
    //         document.getElementById('genderError').textContent = 'Gender is required';
    //         isValid = false;
    //     }

    //     // Country validation
    //     if (!formData.country) {
    //         document.getElementById('countryError').textContent = 'Country is required';
    //         isValid = false;
    //     }

    //     // Date of birth validation
    //     if (!formData.date_of_birth) {
    //         document.getElementById('ageError').textContent = 'Date of birth is required';
    //         isValid = false;
    //     }

    //     // Password validation
    //     if (!formData.password) {
    //         document.getElementById('passwordError').textContent = 'Password is required';
    //         isValid = false;
    //     }

    //     // Confirm password validation
    //     if (formData.password !== formData.confirmpassword) {
    //         document.getElementById('confirmpasswordError').textContent = 'Passwords do not match';
    //         isValid = false;
    //     }

    //     // address validation
    //     if (formData.address !== formData.confirmpassword) {
    //         document.getElementById('confirmpasswordError').textContent = 'Passwords do not match';
    //         isValid = false;
    //     }

    //     // Terms validation
    //     if (!document.getElementById('terms').checked) {
    //         document.getElementById('termsError').textContent = 'You must agree to the terms';
    //         isValid = false;
    //     }

    //     return isValid;
    // }

    // // Email validation function
    // function validateEmail(email) {
    //     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return re.test(email);
    // }

    // Display confirmation message upon successful form submission
    // function displayConfirmation() {
    //     confirmationMessage.textContent = 'Form submitted successfully! Below are the summary of your the details you submitted';
    // }
// });


// appointment booking form validation

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('appointmentForm');
//     const appointmentSummaryContent = document.getElementById('appointmentSummaryContent');
//     const appointmentSummarySection = document.querySelector('.form-summary');
//     const confirmationMessage = document.getElementById('confirmationMessage');

//     const appointmentData = {};

//     // Fields to track
//     const fields = ['doctor', 'date', 'time', 'notes'];

//     // Event listeners to capture changes but update summary only on submission
//     fields.forEach(field => {
//         const inputElement = document.getElementById(field);
//         inputElement.addEventListener('input', function () {
//             captureData(field, inputElement);
//         });
//     });

//     // Handle form submission
//     form.addEventListener('submit', function (event) {
//         event.preventDefault();  // Prevent default form submission behavior
//         if (validateForm()) {
//             displayAppointmentSummary();  // Display summary only on successful form submission
//             displayConfirmation();
//         }
//     });

//     // Function to capture data from form fields
//     function captureData(field, inputElement) {
//         appointmentData[field] = inputElement.value;
//     }

//     // Function to display the captured form data in the summary section
//     function displayAppointmentSummary() {
//         appointmentSummaryContent.innerHTML = '';  // Clear previous summary
//         Object.keys(appointmentData).forEach(key => {
//             let displayValue = appointmentData[key];

//             // Mask 'notes' if needed for sensitive information
//             if (key === 'notes' && displayValue.trim() === '') {
//                 displayValue = 'No additional notes provided';
//             }

//             appointmentSummaryContent.innerHTML += `<p><strong>${key}:</strong> ${displayValue}</p>`;
//         });
//         appointmentSummarySection.style.display = 'block';  // Show the form summary section
//     }

//     // Form validation function
//     function validateForm() {
//         let isValid = true;

//         // Clear all error messages
//         fields.forEach(field => {
//             document.getElementById(field + 'Error').textContent = '';
//         });

//         // Doctor selection validation
//         if (!appointmentData.doctor) {
//             document.getElementById('doctorError').textContent = 'Specialist is required';
//             isValid = false;
//         }

//         // Date validation
//         if (!appointmentData.date) {
//             document.getElementById('dateError').textContent = 'Appointment date is required';
//             isValid = false;
//         }

//         // Time validation
//         if (!appointmentData.time) {
//             document.getElementById('timeError').textContent = 'Appointment time is required';
//             isValid = false;
//         }

//         // Note validation
//         if (!appointmentData.notes) {
//             document.getElementById('notesError').textContent = 'Please provide a message for the specialist';
//             isValid = false;
//         }

//         return isValid;
//     }

//     // Display confirmation message upon successful form submission
//     function displayConfirmation() {
//         confirmationMessage.textContent = 'Appointment booked successfully!';
//     }
// });

// // login page validation

// function validateLoginForm() {
//     let valid = true;
  
//     // Clear previous error messages
//     document.getElementById("emailError").innerHTML = "";
//     document.getElementById("passwordError").innerHTML = "";
  
//     // Validate email
//     let email = document.getElementById("email").value;
//     if (email === "") {
//       document.getElementById("emailError").innerHTML = "Error! Email is required.";
//       valid = false;
//     } else if (!validateEmail(email)) {
//       document.getElementById("emailError").innerHTML = "Error! Please enter a valid email address.";
//       valid = false;
//     }
  
//     // Validate password
//     let password = document.getElementById("password").value;
//     if (password === "") {
//       document.getElementById("passwordError").innerHTML = "Error! Password is required.";
//       valid = false;
//     }
  
//     return valid;
//   }

//   // faq page

//   document.querySelectorAll('.faq-header').forEach(item => {
//     item.addEventListener('click', event => {
//         // Toggle active class
//         item.classList.toggle('active');

//         // Find the next sibling element (faq-body)
//         let body = item.nextElementSibling;
//         if (body.style.display === 'block') {
//             body.style.display = 'none';
//         } else {
//             body.style.display = 'block';
//         }
//     });
// });



// async function fetchDoctors() {
//     try {
//         const response = await fetch('/getAllDoctors');
//         const doctors = await response.json();

//         const doctorsList = document.getElementById('doctorsList');
//         doctorsList.innerHTML = '';

//         if (doctors.length > 0) {
//         doctors.forEach(doctor => {
//             doctorsList.innerHTML += `
//             <tr>
//                 <td class="p-2">${doctor.first_name} ${doctor.last_name}</td>
//                 <td class="p-2">${doctor.specialization}</td>
//                 <td class="p-2">${doctor.email}</td>
//                 <td class="p-2">${doctor.phone}</td>
//                 <td class="p-2">
//                 <button onclick="openEditModal(${doctor.id})" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
//                 <button onclick="deleteDoctor(${doctor.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
//                 </td>
//             </tr>
//             `;
//         });
//         } else {
//         // Handle empty doctor list (e.g., display message, loading indicator)
//         doctorsList.innerHTML = '<p>No doctors found.</p>';
//         }
//     } catch (error) {
//         console.error('Error fetching doctors:', error);
       
//     }
//     }


async function fetchDoctors() {
    try {
        const response = await fetch('/getAllDoctors');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const doctors = await response.json();

        const doctorsList = document.getElementById('doctorsList');
        doctorsList.innerHTML = '';

        if (doctors.length > 0) {
            doctors.forEach(doctor => {
                doctorsList.innerHTML += `
                <tr>
                    <td class="p-2">${doctor.first_name} ${doctor.last_name}</td>
                    <td class="p-2">${doctor.specialization}</td>
                    <td class="p-2">${doctor.email}</td>
                    <td class="p-2">${doctor.phone}</td>
                    <td class="p-2">
                        <button onclick="openEditModal(${doctor.id})" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                        <button onclick="deleteDoctor(${doctor.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                </tr>
                `;
            });
        } else {
            doctorsList.innerHTML = '<p>No doctors found.</p>';
        }
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}


    // Delete doctor
    async function deleteDoctor(id) {
        if (confirm('Are you sure you want to delete this doctor?')) {
            try {
                await fetch(`/deleteDoctor/${id}`, { method: 'DELETE' });
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
            }
        }
    }

    // Edit doctor modal
    function openEditModal(id) {
        document.getElementById('editModal').classList.remove('hidden');
        document.getElementById('editModal').classList.add('flex');
        fetchDoctorDetails(id);
    }

    function closeEditModal() {
        document.getElementById('editModal').classList.add('hidden');
        document.getElementById('editModal').classList.remove('flex');
    }

    async function fetchDoctorDetails(id) {
        try {
            const response = await fetch(`/getDoctorById/${id}`);
            const doctor = await response.json();
            document.getElementById('editDoctorId').value = doctor.id;
            document.getElementById('editFirstName').value = doctor.first_name;
            document.getElementById('editLastName').value = doctor.last_name;
            document.getElementById('editSpecialization').value = doctor.specialization;
            document.getElementById('editPhone').value = doctor.phone;
            document.getElementById('editSchedule').value = JSON.stringify(doctor.schedule);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
        }
    }

    // Update doctor
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editDoctorId').value;
        const data = {
            first_name: document.getElementById('editFirstName').value,
            last_name: document.getElementById('editLastName').value,
            specialization: document.getElementById('editSpecialization').value,
            phone: document.getElementById('editPhone').value,
            schedule: JSON.parse(document.getElementById('editSchedule').value)
        };
        try {
            await fetch(`/updateDoctor/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            closeEditModal();
            fetchDoctors();
        } catch (error) {
            console.error('Error updating doctor:', error);
        }
    });

    // Initial fetch
    fetchDoctors();



// function getUserInfo() {
//     // Get the user object from the session storage
//     const user = sessionStorage.getItem('user');

//     // Parse the user object (if it's a JSON string)
//     const parsedUser = JSON.parse(user);

//     // Update the HTML content with the user's information
//     const userInfoElement = document.getElementById('user-info');
//     userInfoElement.innerHTML = `Hello, ${parsedUser.name}!`;
// }

// // Call the getUserInfo function when the page loads
// window.addEventListener('load', getUserInfo);
