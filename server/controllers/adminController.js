const Admin = require('../models/Admin');

const getAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find();

        if (admins.length === 0) {
            return res.status(404).json({ message: "No admins found" });
        }

        return res.status(200).json(admins);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAdmins };