const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");

router.get("/", artistController.getArtists);
router.get("/search", artistController.searchArtists);
router.get("/:id", artistController.getArtistById);
router.put("/:id", artistController.updateArtist);
router.delete("/:id", artistController.deleteArtist);

module.exports = router;
