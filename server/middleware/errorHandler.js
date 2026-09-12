const errorHandler = (err, req, res, next) => {
    console.error(`ERROR: ${err.message}`);
    console.error(err.stack);

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }
    if (err.name === "CastError") {
        return res.status(400).json({ message: `Invalid value for ${err.path}` });
    }
    // Unique index violation, e.g. an admin reusing a username or email
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue ?? {})[0];
        return res.status(409).json({
            message: field ? `That ${field} is already in use` : "That record already exists",
        });
    }

    return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
