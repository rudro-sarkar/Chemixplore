
async function loadHomepage(req, res) {
    res.render('home-page', {username: req.session.username});
}

module.exports = {
    loadHomepage,
}