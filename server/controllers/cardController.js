const Card = require("../models/Card"); // Adjust the path as necessary

// Create a new card
exports.createCard = async (req, res) => {
  try {
    const { cardNumber, expirationDate, cvv } = req.body;
    const newCard = new Card({ cardNumber, expirationDate, cvv });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all cards
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get card by ID
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a card
exports.updateCard = async (req, res) => {
  try {
    const { cardNumber, expirationDate, cvv } = req.body;
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { cardNumber, expirationDate, cvv },
      { new: true, runValidators: true }
    );
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a card
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
