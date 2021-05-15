const nodemailer = require('nodemailer');
const SendEmail = async(options) => {
    //create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    //define email options
    const mailOptions = {
        from: process.EMAIL_USERNAME,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    await transporter.sendMail(mailOptions);
}
module.exports = SendEmail;