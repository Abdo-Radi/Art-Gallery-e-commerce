const router = require("express").Router();
const artworkController = require("../controllers/artworkContoller");
const { isAuthorized } = require("../middleware/authorization");
const { verifyToken } = require("../middleware/jwt");

router.get("/", artworkController.getArtworks);
router.get("/:id", artworkController.getArtworkById);

router.use(verifyToken);
router.use(isAuthorized("artist", "admin"));

router.post("/", artworkController.createArtwork);
router.put("/:id", artworkController.updateArtwork);
router.delete("/:id", artworkController.deleteArtwork);

module.exports = router;
