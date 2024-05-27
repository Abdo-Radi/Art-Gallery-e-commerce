const Ticket = require("../models/Ticket");

const createTicket = async (req, res, next) => {
  try {
    const newTicket = new Ticket(req.body);
    const savedTicket = await newTicket.save();

    const dataToSend = await Ticket.findById(savedTicket._id).populate({
      path: "exhibition",
      select: "name",
    });

    res.status(201).json(dataToSend);
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const { search, page, exhibition, priceSort, maxPrice } = req.query;
    const options = {
      lean: true,
      populate: "exhibition",
      page: page || 1,
      limit: 9,
    };
    console.log(search,exhibition,priceSort,maxPrice)
    const searchQuery = {
      ...(search && { "exhibition.name": { $regex: new RegExp(search, "i") } }),
      ...(exhibition && { exhibition }),
      ...(maxPrice && { price: { $lte: Number(maxPrice) } }),
    };
    console.log(searchQuery)
    if (priceSort) {
      options.sort = { price: priceSort === "lowToHigh" ? 1 : -1 };
    }

    const tickets = await Ticket.paginate(searchQuery, options);

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId).populate({
      path: "exhibition",
      select: "name",
    });

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

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    Object.assign(ticket, req.body);

    const updatedTicket = await ticket.save();

    const dataToSend = await Ticket.findById(updatedTicket._id).populate({
      path: "exhibition",
      select: "name",
    });

    res.status(200).json(dataToSend);
  } catch (error) {
    next(error);
  }
};

const deleteTicketById = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
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
