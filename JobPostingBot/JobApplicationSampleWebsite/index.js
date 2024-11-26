const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Job.html'));
});

// Other routes like /electrician.html, /plumber.html, etc.

// Configure the email transport using nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rushitalingiah@outlook.com',
    pass: 'Madvi127',
  },
});

app.post('/send-email', upload.fields([{ name: 'applicationForm' }, { name: 'nic' }]), (req, res) => {
  const applicantName = req.body.applicantName;
  const emailBody = req.body.emailBody;
  const position = req.body.position;
  const applicationForm = req.files['applicationForm'][0];
  const nic = req.files['nic'][0];

 
  const mailOptions = {
    from: 'rushitalingiah@outlook.com', // Use applicant's email as sender
    to: 'rushitalingiah@outlook.com', // Change to your own email or recipient's email
    subject: `Job Application for ${position}`,
    text: emailBody,
    attachments: [
      {
        filename: `${applicantName}_application${path.extname(applicationForm.originalname)}`,
        path: applicationForm.path,
      },
      {
        filename: `${applicantName}_nic${path.extname(nic.originalname)}`,
        path: nic.path,
      },
    ],
  };


  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('An error occurred while sending the application.');
    }
    console.log('Email sent: ' + info.response);
    res.send('Application submitted successfully!');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
