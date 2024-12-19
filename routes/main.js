require('dotenv').config();

const main = require('express').Router();

// controllers
const loing_page_controller = require("../controllers/loginPage");
const home_page_controller = require("../controllers/homePage");

// middlewares
const session_validation = require("../middlewares/session_validation");

const auth_session = require('express-session');

main.use(auth_session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // (7 days)
    }
}));

main.get('/login', session_validation.is_login_unsaved, loing_page_controller.load_login_page);
main.post('/request_user_access', session_validation.is_login_unsaved, loing_page_controller.log_user);

main.get('/join', session_validation.is_join_requested, loing_page_controller.load_join_page);
main.post('/join', session_validation.is_join_requested, loing_page_controller.verify_and_create_user);
main.post('/email_verification', session_validation.is_code_sent, loing_page_controller.register_user);
main.get('/email_verification', loing_page_controller.reset_registration);
main.get('/abort_and_restart_registration', loing_page_controller.reset_registration);

main.get('/home', session_validation.is_login_saved, home_page_controller.loadHomepage);

module.exports = main;