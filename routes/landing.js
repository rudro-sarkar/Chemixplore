
const landing = require('express').Router();

const landing_page_controller = require("../controllers/landingPage");

landing.get('/', landing_page_controller.load_preloader);

module.exports = landing;