const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "You are not logged in" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = {
            userId: data.userId,
            accountType: data.accountType
        };
        next();
    });
};

module.exports = { verifyToken };