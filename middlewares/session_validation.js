
async function is_login_unsaved(req, res, next) {
    if (!req.session.username) {
        next();
    } else {
        res.redirect('/home');
    }
}

async function is_login_saved(req, res, next) {
    if (req.session.username) {
        next();
    }else {
        res.redirect('/login');
    }
}

async function is_join_requested(req, res, next) {
    if (!req.session.register_session) {
        next();
    }else {
        res.redirect('/email_verification')
    }
}

async function is_code_sent(req, res, next) {
    if (req.session.register_session) {
        next();
    }else {
        req.session.destroy();
        res.redirect('/join');
    }
}

module.exports = {
    is_login_unsaved,
    is_login_saved,
    is_join_requested,
    is_code_sent
}