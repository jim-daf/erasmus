const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs'); // Require the fs module
require('dotenv').config();

const EMAIL = 'erasmusplusduth@gmail.com';
const PASSWORD = 'snbm ntoa wxuf cypi';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like your HTML form)
app.use(express.static('./'));

// Use express.json() if you're expecting JSON input
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Rename the file
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit    
    } });

// Handle form submission
app.post('/submit',upload.single('pdf_file'), (req, res) => {
    const { firstname, lastname,email, teachers, subject} = req.body;
    console.log('Form Data:', { firstname, lastname, email, teachers, subject});
    
    // Here, you can process the data, save it to a database, etc.

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Replace with your email 'jimdaf11@gmail.com'
            pass: process.env.PASSWORD // Replace with your email password 'effh sqye inav xyxd'
        }
    });

    // Email options
    let mailOptions = {
        from: email, // Sender address
        to: teachers, // List of recipients
        subject: `Αίτηση Πρακτικής Άσκησης (${email})`, // Subject line
        text: `Λάβατε μια νέα αίτηση πρακτικής άσκησης από τον/την φοιτητή/φοιτήτρια ${firstname} ${lastname}.\n\nΚάποια λόγια του φοιτητή: ${subject}`, // Plain text body
        replyTo: email,
        attachments: [
            {
                filename: req.file.originalname, // Original file name
                path: req.file.path, // Path to the uploaded file
                contentType: 'application/pdf'
            }
        ]
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(`Error: ${error}`);

        }
        console.log(`Message Sent successfully!! : ${info.response}`);
        // Delete the file after sending the email
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err}`);
                return res.status(500).send('Error deleting the uploaded file'); // Optional: Send an error response
            }
            console.log(`Successfully deleted ${req.file.path}`);
            res.status(200).send('Email sent and file deleted successfully'); // Send success response
        })
    });
    
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'form.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://192.168.1.2:${PORT}`);
});
