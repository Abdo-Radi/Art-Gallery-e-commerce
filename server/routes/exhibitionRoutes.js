const router = require("express").Router();
const exhibitionController = require("../controllers/exhibitionController");

router.post("/", exhibitionController.createExhibition);
router.get("/", exhibitionController.getExhibitions);
router.get("/:id", exhibitionController.getExhibitionById);
router.put("/:id", exhibitionController.updateExhibition);
router.delete("/:id", exhibitionController.deleteExhibition);

module.exports = router;
