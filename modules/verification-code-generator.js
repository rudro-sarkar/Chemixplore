
function gen_verification_code() {
    const code = Math.floor(10000000 + Math.random() * 90000000);
    return code.toString();
}

module.exports = gen_verification_code;