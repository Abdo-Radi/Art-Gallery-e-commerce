const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { exhibitionId, price, quantity } = req.body;

    // Create a new Ticket instance
    const newTicket = new Ticket({
      exhibitionId,
      price,
      quantity,
    });

    // Save the new Ticket to the database
    const savedTicket = await newTicket.save();

    res.status(201).json(savedTicket);
  } catch (error) {
    console.error("Error creating Ticket:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

const getTickets = async (req, res, next) => {
  try {
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const skipCount = (page - 1) * limit;

    const totalTicketsCount = await Ticket.countDocuments();
    const tickets = await Ticket.find().skip(skipCount).limit(limit);

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }

    res.status(200).json({
      status: 200,
      data: tickets,
      totalPages: Math.ceil(totalTicketsCount / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid ticket ID",
      });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: 404,
        message: "Ticket not found",
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error getting Ticket by ID:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { exhibitionId, price, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid ticket ID",
      });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: 404,
        message: "Ticket not found",
      });
    }

    if (exhibitionId !== undefined) {
      ticket.exhibitionId = exhibitionId;
    }

    if (price !== undefined) {
      ticket.price = price;
    }

    if (quantity !== undefined) {
      ticket.quantity = quantity;
    }

    const updatedTicket = await ticket.save();

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error updating Ticket:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

const deleteTicketById = async (req, res) => {
  const ticketId = req.params.id;

  try {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    return res.status(200).json({ message: "Ticket deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting ticket", error: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicketById,
};
