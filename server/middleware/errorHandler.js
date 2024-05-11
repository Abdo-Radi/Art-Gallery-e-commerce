const errorHandler = (err, req, res, next) => {
    console.log(`ERROR: ${err.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
