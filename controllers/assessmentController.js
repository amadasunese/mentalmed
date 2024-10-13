// Helper function to analyze responses
function analyzeResponses(answers) {  // Corrected here
    let yesCount = 0;
    const yesIndices = [];

    answers.forEach((answer, index) => {
        if (answer.toLowerCase() === 'yes') {
            yesCount++;
            yesIndices.push(index);
        }
    });

    // Determine recommendations based on 'yes' answers
    let recommendation = '';
    let specialists = [];

    // Example logic: Map question indices to specialists
    const specialistMap = {
        0: 'Sleep Specialist',
        1: 'Psychologist',
        2: 'Counselor',
        3: 'Behavioral Therapist',
        4: 'Anxiety Specialist',
        5: 'Stress Management Specialist',
        6: 'Mood Disorder Specialist',
        7: 'Energy Management Specialist',
        8: 'Reality Perception Specialist',
        9: 'Concentration Specialist',
        10: 'Self-Esteem Therapist',
        11: 'Social Interaction Specialist'
    };

    if (yesCount > 0) {
        // Collect specialists based on 'yes' answers
        yesIndices.forEach(index => {
            if (specialistMap[index] && !specialists.includes(specialistMap[index])) {
                specialists.push(specialistMap[index]);
            }
        });

        // Create a recommendation message
        recommendation = 'Based on your responses, we recommend booking an appointment with the following specialist(s):';
    } else {
        recommendation = 'Based on your responses, you may find the following FAQ articles helpful:';
    }

    return {
        totalQuestions: answers.length,
        yesCount,
        yesIndices,
        specialists,
        recommendation
    };
};

// Function to handle self-assessment form submission
exports.handleSelfAssessment = async (req, res) => {
    // Log the received form data for debugging
    console.log('Self-Assessment Form Data:', req.body);

    // Ensure that the form data is not null or undefined
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send('Form submission error: No data received');
    }

    // Extract answers from the form submission
    const answers = Object.values(req.body);

    // Analyze the answers to determine recommendations
    const analysis = analyzeResponses(answers);

    // Store the analysis in the session if needed
    req.session.assessment = analysis;

    res.render('summary', {
        analysis,
        user: req.session.user || null
    });

};

