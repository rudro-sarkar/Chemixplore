
const User = require("../models/User");

const bcryptjs = require('bcryptjs');

// modules
const verification_code_gen = require("../modules/verification-code-generator");
const send_email = require("../modules/email-sender");
const input_validator = require("../modules/input-validator");

async function load_login_page(req, res) {
    res.render('login-page', { err: 'no' });
}

async function log_user(req, res) {
    const { username: entered_username, password: entered_password } = req.body;
    const doc = await User.findOne({
        $or: [
            { username: entered_username }, { email: entered_username }
        ]
    });
    if (doc) {
        const pass = doc.password;
        const is_pass_correct = await bcryptjs.compare(entered_password, pass);
        if (is_pass_correct) {
            req.session.username = doc.username;
            res.redirect('/home');
        } else {
            res.render('login-page', { err: 'Invalid credentials' });
        }
    } else {
        res.render('login-page', { err: 'Invalid credentials' });
    }
}

async function load_join_page(req, res) {
    res.render('join-page', { err: 'no' });
}

async function verify_and_create_user(req, res) {
    const { email: entered_email, username: entered_username, password: entered_password } = req.body;
    const input_validation_status = await input_validator.registration_input_validator(entered_email, entered_username, entered_password);
    if (input_validation_status == 'good') {
        const doc = await User.findOne({
            $or: [
                { email: entered_email }, { username: entered_username }
            ]
        });
        if (doc) {
            res.render('join-page', { err: 'A user associated with this email or username already exists!' });
        } else {
            const hashed_pass = await bcryptjs.hash(entered_password, 10);
            const verification_code = verification_code_gen();

            req.session.register_session = {
                reg_email: entered_email,
                reg_username: entered_username,
                password: hashed_pass,
                verification_code: verification_code
            }

            const html = `
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif;">
        <div style="background-color: #6a0dad; color: #ffffff; text-align: center; padding: 20px 10px;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Chemixplore!</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333333; margin: 15px 0;">Hi there,</p>
            <p style="font-size: 16px; color: #333333; margin: 15px 0;">
                Thank you for signing up for Chemixplore! To verify your email address, please use the following verification code:
            </p>
            <div style="font-size: 24px; color: #6a0dad; font-weight: bold; background-color: #f4e8ff; padding: 10px 20px; border-radius: 4px; display: inline-block; margin: 10px 0;">
                ${verification_code}
            </div>
            <p style="font-size: 16px; color: #333333; margin: 15px 0;">
                If you did not sign up for Chemixplore, please ignore this email.
            </p>
        </div>
    </div>
            `;

            send_email(entered_email, "Verify your Chemixplore account", html);

            res.render('verify-email', { err: 'no' });
        }
    } else {
        res.render('join-page', { err: input_validation_status });
    }

}

async function register_user(req, res) {
    const credentials = req.session.register_session;
    const entered_verification_code = req.body.verificatio_code;
    // req.session.destroy();
    const reg_email = credentials.reg_email;
    const reg_username = credentials.reg_username;
    const reg_pass = credentials.password;
    if (credentials.verification_code == entered_verification_code) {
        User.insertMany([{
            email: reg_email,
            username: reg_username,
            password: reg_pass
        }]).then(() => {
            req.session.username = reg_username;
            res.redirect('/home');
        }).catch(err => console.log(err));
    } else {
        res.render('verify-email', { err: 'Invalid verification code!' });
    }
}

async function reset_registration(req, res) {
    req.session.destroy();
    res.redirect('/join');
}

module.exports = {
    load_login_page,
    log_user,
    load_join_page,
    verify_and_create_user,
    register_user,
    reset_registration,
}