const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");
const { isAuthorized } = require("../middleware/authorization");

router.get("/", artistController.getArtists);
router.get("/:id", artistController.getArtistById);

router.use(isAuthorized("admin"));

router.post("/", artistController.addArtist);
router.put("/:id", artistController.updateArtist);
router.delete("/:id", artistController.deleteArtist);

module.exports = router;
