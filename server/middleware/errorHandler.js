const errorHandler = (err, req, res, next) => {
    console.error(`ERROR: ${err.message}`);
    console.error(err.stack);

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }
    if (err.name === "CastError") {
        return res.status(400).json({ message: `Invalid value for ${err.path}` });
    }

    return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
