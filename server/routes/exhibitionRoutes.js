const express = require("express");
const router = express.Router();
const exhibitionController = require("../controllers/exhibitionController");

router.post("/", exhibitionController.createExhibition);
router.get("/", exhibitionController.getExhibitions);
router.get("/:id", exhibitionController.getExhibitionById);
router.put("/:id", exhibitionController.updateExhibition);
router.delete("/:id", exhibitionController.deleteExhibitionById);

module.exports = router;
