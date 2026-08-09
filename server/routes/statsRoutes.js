const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");
const { isAuthorized } = require("../middleware/authorization");
const { verifyToken } = require("../middleware/jwt");

router.get("/", verifyToken, isAuthorized("admin"), getStats);

module.exports = router;
