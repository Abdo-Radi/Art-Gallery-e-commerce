const bcrypt = require('bcrypt');

const hash = async (password) => {
    return await bcrypt.hash(password, 10);
};

const validatePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

module.exports = { hash, validatePassword };