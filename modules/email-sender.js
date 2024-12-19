
require('dotenv').config();

const app_pass = process.env.APP_PASSWORD;

const nodemailer = require('nodemailer');

const auth = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: "chemixploreservices@gmail.com",
        pass: app_pass
    }
});

function send_mail(msgreceiver, subject, html) {
    const receiver = {
        from: "chemixploreservices@gmail.com",
        to: msgreceiver,
        subject: subject,
        html: html
    }

    auth.sendMail(receiver, (error, response) => {
        if (error) throw error;
    });

}

module.exports = send_mail;