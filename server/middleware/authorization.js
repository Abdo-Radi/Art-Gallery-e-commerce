const isAuthorized = (...allowedUsers) =>
    (req, res, next) => {
        if (!allowedUsers.includes(req.user.accountType)) {
            return res.status(403).json({ message: "You are not allowed to perform this action" });
        }
        next();
    };

module.exports = { isAuthorized };