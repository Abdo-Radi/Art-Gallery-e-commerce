const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");
const { isAuthorized } = require("../middleware/authorization");
const { verifyToken } = require("../middleware/jwt");

router.use(verifyToken);
// Artist accounts hold emails and usernames: admins only, reads included.
// (Artist names still reach the public through the artwork endpoints.)
router.use(isAuthorized("admin"));

router.get("/", artistController.getArtists);
router.get("/:id", artistController.getArtistById);
router.post("/", artistController.addArtist);
router.put("/:id", artistController.updateArtist);
router.delete("/:id", artistController.deleteArtist);

module.exports = router;
