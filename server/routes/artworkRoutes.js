const express = require("express");
const router = express.Router();
const artworkController = require("../controllers/artworkContoller");

router.post("/", artworkController.createArtwork);
router.get("/", artworkController.getArtworks);
router.get("/:id", artworkController.getArtworkById);
router.get("/search", artworkController.searchArtworks);
router.put("/:id", artworkController.updateArtwork);
router.delete("/:id", artworkController.deleteArtworkById);

module.exports = router;
