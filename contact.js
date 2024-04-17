const fs = require('fs'); // Import the file system module

// Route to handle form submissions
app.post('/contact', validateForm, (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Process valid form submission
    const { name, email, message } = req.body;

    // Send email (example using nodemailer)
    const transporter = nodemailer.createTransport({
        // Configure email transporter settings (e.g., SMTP)
    });

    const mailOptions = {
        from: email,
        to: 'your@email.com',
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMobile Number: ${number} \nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Server error');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Message sent successfully');
    });

    // Append form submission data to contact_json.json
    const submissionData = {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

    fs.readFile('contact_json.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Server error');
        }

        let submissions = [];
        if (data) {
            submissions = JSON.parse(data);
        }
        submissions.push(submissionData);

        fs.writeFile('contact_json.json', JSON.stringify(submissions, null, 2), err => {
            if (err) {
                console.error('Error writing to file:', err);
                return res.status(500).send('Server error');
            }
            console.log('Form submission saved to contact_json.json');
        });
    });
});
