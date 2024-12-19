
const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const username_regex = /^[a-z0-9]+$/

async function registration_input_validator(email, username, password) {
    let is_email_valid = email_regex.test(email);
    let username_condition;
    let password_condition;
    if (!username_regex.test(username.toLowerCase())) {
        username_condition = 'invalid';
    }else {
        if (username.length < 4 || username.length > 10) {
            username_condition = 'short_or_long';
        } else {
            username_condition = 'good';
        }
    }
    if (password.length < 8) {
        password_condition = 'short'
    }else {
        password_condition = 'good';
    }

    if (!is_email_valid) {
        return 'Email address is incorrect!';
    }

    if (username_condition == 'invalid') {
        return "Username can't contain special characters!";
    }

    if (username_condition == 'short_or_long') {
        return 'Username must be 4-10 characters!';
    }

    if (password_condition == 'short') {
        return 'Password must be at least 8 characters!';
    }

    if (is_email_valid == true && username_condition == 'good' && password_condition == 'good') {
        return 'good';
    }
}

module.exports = {
    registration_input_validator
}