const router = require("express").Router();
const artworkController = require("../controllers/artworkContoller");
const { isAuthorized } = require("../middleware/authorization");

router.get("/", artworkController.getArtworks);
router.get("/:id", artworkController.getArtworkById);

router.use(isAuthorized("artist", "admin"));

router.post("/", artworkController.createArtwork);
router.put("/:id", artworkController.updateArtwork);
router.delete("/:id", artworkController.deleteArtworkById);

module.exports = router;
