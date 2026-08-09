const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const { isAuthorized } = require("../middleware/authorization");
const { verifyToken } = require("../middleware/jwt");

router.use(verifyToken);
router.use(isAuthorized("admin"));

// Create a new card
router.post("/", cardController.createCard);

// Get all cards
router.get("/", cardController.getAllCards);

// Get card by ID
router.get("/:id", cardController.getCardById);

// Update a card
router.put("/:id", cardController.updateCard);

// Delete a card
router.delete("/:id", cardController.deleteCard);

module.exports = router;
