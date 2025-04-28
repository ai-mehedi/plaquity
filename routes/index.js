var express = require('express');
var router = express.Router();
const EmailModel = require("../models/email");
const ContactModel = require("../models/contact");
const nodemailer = require("nodemailer");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/thankyou', function (req, res, next) {
  res.render('thankyou', { title: 'Express' });
});
router.post("/email", async (req, res) => {
  try {
    // Send the email
    await EmailModel.create(req.body);
    return res.redirect("/thankyou");
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
});


// POST route for contact form submissions
router.post("/send-email", async (req, res) => {
  try {
    const { name, email, message, number } = req.body;

    if (!name || !email || !message || !number) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "pixmatechsmtp@gmail.com",
        pass: "btxd rvfz zgdt lipz",
      },
    });
    // Email options
    const mailOptions = {
      from: email,
      // to: "pixmatechsmtp@gmail.com",
      to: "pixmatechgrowth@gmail.com",
      subject: `${name} from ${email}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; line-height: 1.6;">
          <div style="text-align: center; padding-bottom: 15px; border-bottom: 3px solid #007bff;">
            <h2 style="color: #007bff; font-size: 24px; font-weight: bold; margin-bottom: 5px;">📩 New Message Received</h2>
            <p style="font-size: 16px; color: #555;">You have a new contact form submission.</p>
          </div>
          <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <p style="font-size: 18px; color: #333; margin: 8px 0;"><strong>👤 Name:</strong> ${name}</p>
            <p style="font-size: 18px; color: #333; margin: 8px 0;"><strong>📧 Email:</strong>
              <a href="mailto:${email}" style="color: #007bff; text-decoration: none; font-weight: bold;">${email}</a>
            </p>
            <p style="font-size: 18px; color: #333; margin: 8px 0;">
  <strong>📞 Number:</strong> ${number}
</p>
          </div>
          <div style="margin-top: 20px; padding: 20px; background-color: #F7F7F7; border-radius: 8px;">
            <p style="font-size: 18px; color: #007bff; font-weight: bold; margin-bottom: 10px;">💬 Message:</p>
            <p style="font-size: 16px; color: #333; background-color: #ffffff; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">${message}</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; font-size: 18px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              📩 Reply to ${name}
            </a>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
            &copy; 2024 Your Company | All rights reserved.
          </p>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    await ContactModel.create({ name, email, message, number });
    return res.redirect("/thankyou");
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
});



module.exports = router;
