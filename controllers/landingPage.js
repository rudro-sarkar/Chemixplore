
const tooltips = require('../data/tooltips');

async function load_preloader(req, res) {
    let random = Math.floor(Math.random()*100);
    res.render('universal-preloader', { tooltips: tooltips[random] });
}

module.exports = {
    load_preloader,
}

