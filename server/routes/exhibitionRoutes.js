const router = require("express").Router();
const exhibitionController = require("../controllers/exhibitionController");
const { isAuthorized } = require("../middleware/authorization");
const { verifyToken } = require("../middleware/jwt");

router.get("/", exhibitionController.getExhibitions);
router.get("/:id", exhibitionController.getExhibitionById);

router.use(verifyToken);
router.use(isAuthorized("admin"));

router.post("/", exhibitionController.createExhibition);
router.put("/:id", exhibitionController.updateExhibition);
router.delete("/:id", exhibitionController.deleteExhibition);

module.exports = router;
