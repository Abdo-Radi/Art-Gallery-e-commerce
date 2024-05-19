const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

const createTicket = async (req, res, next) => {
  try {
    const newTicket = new Ticket({ ...req.body });

    const savedTicket = await newTicket.save();

    res.status(201).json(savedTicket);
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const { page } = req.query;
    const options = {
      lean: true,
      populate: "exhibition",
      page,
    };

    const tickets = await Ticket.paginate({}, options);

    if (tickets.length === 0) {
      return res.status(204).json({ message: "No tickets found" });
    }

    const totalDocs = await Ticket.countDocuments();

    res.status(200).json({
      ...tickets,
      totalDocs,
    });
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const { exhibitionId, price, quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
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
    next(error);
  }
};

const deleteTicketById = async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicketById,
};
